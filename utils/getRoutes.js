const algoliasearch = require("algoliasearch");
const client = algoliasearch("N7UFARQ48L", "8d219c45506c851ab82563e0297891dd");
const indexAlgolia = client.initIndex("GaoNhat_algolia");


// [
//     {
//       path: '/sitemap-products.xml',
//       routes: [
//         // array of URL
//       ]
//     }, {
//       path: '/sitemap-news.xml',
//       routes: () => // promise or function
//     }, {
//       path: '/sitemapindex.xml',
//       sitemaps: [{
//         // array of Sitemap configuration
//       }]
module.exports = async function getAppRoutes() {
    let result = await indexAlgolia
        .search({

        })
        .then(function (responses) {
            // Response from Algolia:
            // https://www.algolia.com/doc/api-reference/api-methods/search/#response-format
            //console.log(responses.hits);
            return responses.hits;
        });
    let routes = result.map(x => {
        return `/indexs/${x.id}`;
    })
    console.log(routes)
    routes.push('/')
    return { path: '/sitemap.xml', gzip: true, generate: false, routes, exclude: ['/auth/**'] };

}