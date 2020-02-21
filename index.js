const express = require('express');
const fs = require('fs');
const handlebars = require('express-handlebars');

const app = express();

app.engine('handlebars', handlebars());
app.set('view engine', 'handlebars');

app.use(express.urlencoded({extended: true}));

app.get('/', (request, response) => {
    const articleFileNames = fs.readdirSync('./articles/');// load all articles from files here - use fs.readdirSync to list all files in a folder
    const articles = []
    articleFileNames.forEach(function (value) {
        let file = fs.readFileSync('./articles/' + value)
        let json = JSON.parse(file)
        articles.push({headline: json.headline, teaser: json.teaserText, url: json.teaserImageUrl, fileName: value})
    })
    articles.forEach(function (article) {
        console.log('article: ' + article.headline)
    })
    console.log('articles: ' + articles)
response.render('home', {articles});
});

function click() {
    console.log('click!')
}

// note the :name below, we can access it using request.params.name
app.get('/article/:name', (request, response) => {

    const fileName = `${__dirname}/articles/${request.params.name}`;

if(fs.existsSync(fileName)){
    const articleString = fs.readFileSync(fileName);
    const article = JSON.parse(articleString);
    response.render('article', {article: article});
} else {
    response.render('not-found');
}
});

app.use(express.static('public'));

app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});