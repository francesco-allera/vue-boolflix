const api = {
    intro: 'https://api.themoviedb.org/3/',
    api_key: 'fd1cb9cd5d1d558ea846661b447dc5cf',
    language: 'en-US'
};
const flags = [
    "af", "am", "ar", "as", "az", "bg", "bn", "bs", "ca", "cn", "cs", "da", "de", "el", "en", "es", "et", "eu", "fi", "fr", "ga", "gd", "gu", "hi", "hr", "ht", "hu", "id", "is", "it", "ja", "kn", "lt", "lv", "mk", "ml", "mn", "mo", "mr", "ms", "my", "ne", "nl", "no", "pa", "pl", "ps", "pt", "ro", "ru", "sh", "sk", "sl", "sr", "sv", "sw", "ta", "th", "tk", "tl", "tr", "tt", "uk", "ur", "uz", "vi", "zh"
];

new Vue({
    el: '#app',
    data: {
        initialData: [
            {
                name: 'home',
                title: 'Best movies and tv shows',
                arr: []
            },
            {
                name: 'news',
                title: 'New on Boolflix',
                arr: []
            },
            {
                name: 'movies',
                title: 'Popular on Boolflix',
                arr: []
            },
            {
                name: 'tv shows',
                title: 'Popular on Boolflix',
                arr: []
            }
        ],
        pagination: 'home',
        idxInitialData: 0,
        allGenres: [],
        currentArray: [],
        noun: '',
        overview: '',
        scrollX: 0,
        space: 0,
        idxModal: null,
        director: '',
        cast: '',
        genres: '',
        showSearch: false,
        query: '',
        searchingData: [
            {
                name: 'all',
                arr: [],
                genres: []
            },
            {
                name: 'movie',
                arr: [],
                genres: [],
                totalPages: 0
            },
            {
                name: 'tv',
                arr: [],
                genres: [],
                totalPages: 0
            }
        ],
        category: 'all',
        genre: 'none',
        actualPage: 1,
        currentGenres: [],
        idxSearchingData: 0
    },
    methods: {
        mixCall(arr, max) {
            let a = [...arr];
            for (let i = a.length - 1; i >= 0; i--) {
                const x = Math.floor(Math.random() * a.length);
                [a[i], a[x]] = [a[x], a[i]];
            }
            return a.slice(0, max);
        },
        reload() {
            window.location.reload();
        },
        changePage(i) {
            this.currentArray = this.initialData[i].arr;
            this.idxInitialData = i;

            this.query = '';
            this.searchingData = [
                { name: 'all', arr: [], genres: [] },
                { name: 'movie', arr: [], genres: [], totalPages: 0 },
                { name: 'tv', arr: [], genres: [], totalPages: 0 }
            ];
            this.category = 'all';
            this.genre = 'none';


            window.scroll({ top: 0, left: 0 });

            if (document.querySelector('.slider'))
                document.querySelector('.slider').scroll({ top: 0, left: 0 });
        },
        clickSearch() {
            if (!this.showSearch) {
                this.query = '';
                /* this.currentArray = [];
                this.category = 'all';
                this.genre = 'none'; */

                setTimeout(() => {
                    document.querySelector('.search-input input').focus();
                    document.querySelector('.search-input input').placeholder = 'Find your title';
                }, 500);
            }

            this.showSearch = !this.showSearch;
            document.querySelector('.search-input input').placeholder = '';
        },
        search() {
            const { intro, api_key, language } = api;
            const query = this.query, page = this.actualPage;

            axios.all([
                axios.get(intro + 'search/movie', { params: { api_key, language, query, page } }),
                axios.get(intro + 'search/tv', { params: { api_key, language, query, page } }),
            ]).then(axios.spread((movie, tv) => {
                this.searchingData[0].arr = [
                    ...this.searchingData[0].arr, ...movie.data.results, ...tv.data.results
                ];
                this.searchingData[1].arr = [...this.searchingData[1].arr, ...movie.data.results];
                this.searchingData[2].arr = [...this.searchingData[2].arr, ...tv.data.results];

                this.searchingData[1].totalPages = movie.data.total_pages;
                this.searchingData[2].totalPages = movie.data.total_pages;

                movie.data.results.forEach(item => {
                    item.genre_ids.forEach(el => {
                        if (!this.searchingData[1].genres.includes(el))
                            this.searchingData[1].genres.push(el);
                        if (!this.searchingData[0].genres.includes(el))
                            this.searchingData[0].genres.push(el);
                    });
                });

                tv.data.results.forEach(item => {
                    item.genre_ids.forEach(el => {
                        if (!this.searchingData[2].genres.includes(el))
                            this.searchingData[2].genres.push(el);
                        if (!this.searchingData[0].genres.includes(el))
                            this.searchingData[0].genres.push(el);
                    });
                });

                this.searchingData.forEach((el1,i1) => {
                    el1.genres.forEach((el2,i2) =>{
                        this.allGenres.forEach((el3,i3) => {
                            if (el3.id === el2) el1.genres[i2] = el3;
                        });
                    });
                });

                this.searchingData.forEach(el => {
                    el.genres = el.genres.filter((e, i, a) => a.findIndex(e2 => e2.id === e.id) === i);
                });

                this.currentArray = this.searchingData[this.idxSearchingData].arr;
                this.currentGenres = this.searchingData[this.idxSearchingData].genres;
            }));
        },
        searching() {
            this.currentArray = [];
            this.searchingData = [
                { name: 'all',   arr: [], genres: [] },
                { name: 'movie', arr: [], genres: [], totalPages: 0 },
                { name: 'tv',    arr: [], genres: [], totalPages: 0 }
            ];
            this.actualPage = 1;
            this.category = 'all';
            this.genre = 'none';

            if (this.query !== '') {
                this.pagination = '';
                this.search();
            } else {
                this.currentArray = this.initialData[this.idxInitialData].arr;
                this.pagination = this.initialData[this.idxInitialData].name;
            }
        },
        bgMain() {
            if (this.initialData[this.idxInitialData].arr.length > 0)
                return 'background-image: linear-gradient(to top, #181818, #181818 44%, transparent 77%, transparent 100%), url("https://image.tmdb.org/t/p/original' + this.initialData[this.idxInitialData].arr[0].backdrop_path + '");';
            else
                return 'background-image: linear-gradient(to top, #181818, #181818 44%, transparent 77%, transparent 100%)';
        },
        slide(i) {
            document.querySelector('.slider').scrollBy(i * this.scrollX, 0);
        },
        spacing() {
            const scrollbarX = 6, cardX = 300;
            let windowX = window.innerWidth - scrollbarX;
            let cards = parseInt(windowX / cardX);
            let rest = windowX % cardX;
            this.space = parseInt(rest / (cards + 1)) + 1;
            this.scrollX = windowX - this.space + cards;
        },
        margin(i) {
            if (i === 0)
                return 'margin-left:' + this.space + 'px;';
            if (i === this.currentArray.length - 1)
                return 'margin-right:' + this.space + 'px;';
        },
        open(i) {
            this.idxModal = i;
            this.returnGenres();
            document.body.classList.add('open-modal');
        },
        getCrew(el) {
            const { intro, api_key, language } = api;
            let category = el.title ? 'movie' : 'tv';

            axios.get(intro + category + '/' + el.id + '/credits', { params: { api_key, language } })
            .then((resp) => {
                this.director = '';
                this.cast = '';

                resp.data.crew.forEach(p =>  {
                    if (p.known_for_department.toLowerCase() === 'directing')
                        this.director = p.name;
                });

                let a = resp.data.cast;
                let arr = (a.length >= 5 ? a.slice(0, 5) : a.slice(0, a.length)).map(el => el.name);
                arr.forEach((el, i, a) => this.cast += (i === a.length - 1 ? el : `${el}, `));
            });
        },
        poster(str) {
            if (str)
                return 'background-image: url("https://image.tmdb.org/t/p/w500' + str + '");';
            else
                return 'background-image: url("./img/placeholder-card.png");';
        },
        returnGenres() {
            let text = [];

            this.currentArray[this.idxModal].genre_ids.forEach(el => {
                this.allGenres.forEach(id => {
                    if (id.id === el) text.push(id.name);
                });
            });

            this.genres = text.join(', ');
        },
        backdrop(path) {
            if (!path)
                return 'background-image: url("./img/placeholder-modal.png");'
            else
                return 'background-image: url("https://image.tmdb.org/t/p/original' + path + '");'
        },
        vote(num) {
            return Math.ceil(num / 2);
        },
        date(str) {
            if (str && str.length > 4)
                return str.substr(0, 4);
        },
        flag(str) {
            let lang = str.toLowerCase();
            return './img/flags/' + (flags.includes(lang) ? lang : 'unknown') + '.svg';
        },
        close() {
            this.idxModal = null;
            this.director = '';
            this.cast = '';
            this. genres = '';
            document.body.classList.remove('open-modal');
        },
        filterCategory(i) {
            this.currentArray = this.searchingData[i].arr;
            this.currentGenres = this.searchingData[i].genres;
            this.idxSearchingData = i;
            this.genre = 'none';
        },
        filtering(el) {
            if (this.genre === 'none') return true;

            let flag;
            el.genre_ids.forEach(id => { if (id === this.genre) flag = true });
            return flag;
        },
        loader() {
            if (this.category === 'all')
                return (this.searchingData[1].totalPages > this.actualPage) || (this.searchingData[2].totalPages > this.actualPage);
            if (this.category === 'movie')
                return this.searchingData[1].totalPages > this.actualPage;
            if (this.category === 'tv')
                return this.searchingData[2].totalPages > this.actualPage;
        },
        continueSearch() {
            this.actualPage++;
            this.search();
        },
        behaviorArrow(elem, arrow) {
            const rect = document.querySelector(elem).getBoundingClientRect();
            const isRectViewed = rect.left >= 0 && rect.right <= (window.innerWidth || document.documentElement.clientWidth);

            if (isRectViewed)
                document.querySelector(arrow).style.display = 'none';
            else
                document.querySelector(arrow).style.display = 'flex';
        },
        truncate(str) {
            return str.length < 480 ? str : (str.slice(0, 477) + '...');
        },
    },
    created() {
        const { intro, api_key, language } = api;

        // Creating array 'home' from initialData
        axios.all([
            axios.get(intro + 'tv/top_rated', { params: { api_key, language } }),
            axios.get(intro + 'movie/top_rated', { params: { api_key, language } })
        ]).then(axios.spread((respTv, respMovie) => {
            let tv = this.mixCall(respTv.data.results, 10);
            let movie = this.mixCall(respMovie.data.results, 10);
            this.currentArray = this.initialData[0].arr = this.mixCall([...tv, ...movie], 20);
        }));

        // Creating array for all possible genres
        axios.all([
            axios.get(intro + 'genre/tv/list', { params: { api_key, language } }),
            axios.get(intro + 'genre/movie/list', { params: { api_key, language } })
        ]).then(axios.spread((respTv, respMovie) => {
            let arr = [...respTv.data.genres, ...respMovie.data.genres];
            this.allGenres = arr.filter((e, i, a) => a.findIndex(e2 => e2.id === e.id) === i);
        }));
    },
    beforeMount() {
        const { intro, api_key, language } = api;

        // Creating remaining arrays for initialData
        axios.all([
            axios.get(intro + 'tv/popular', { params: { api_key, language } }),
            axios.get(intro + 'movie/popular', { params: { api_key, language } })
        ]).then(axios.spread((respTv, respMovie) => {
            this.initialData[3].arr = this.mixCall(respTv.data.results, 20);
            this.initialData[2].arr = this.mixCall(respMovie.data.results, 20);

            this.initialData[1].arr = this.mixCall([
                ...respTv.data.results.slice(0, 10),
                ...respMovie.data.results.slice(0, 10)
            ], 20);
        }));

        this.spacing();
        window.addEventListener('resize', this.spacing);
    },
    mounted() {
        const self = this;

        window.onscroll = (e) => {
            if (window.pageYOffset >= 60)
                document.querySelector('nav').classList.add('scroll');
            else
                document.querySelector('nav').classList.remove('scroll');

            if (document.querySelector('#loader')) {
                const rect = document.querySelector('#loader').getBoundingClientRect();
                const isInViewport = rect.top >= 0 && rect.left >= 0 && rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) && rect.right <= (window.innerWidth || document.documentElement.clientWidth);

                if (isInViewport)
                    self.continueSearch();
            }
        }
    },
    updated() {
        const self = this;

        if (this.currentArray.length > 0) {
            this.noun = this.currentArray[0].name || this.currentArray[0].title;
            this.overview = this.truncate(this.currentArray[0].overview);
        }

        if (document.querySelector('.slider')) {
            document.querySelector('.slider').onscroll = (e) => {
                self.behaviorArrow('.slider .card:first-child', '.slider-prev');
                self.behaviorArrow('.slider .card:last-child', '.slider-next');
            }
        }
    }
});
Vue.config.devtools = true;