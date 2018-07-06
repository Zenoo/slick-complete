# SlickComplete [(Demo)](https://jsfiddle.net/Zenoo0/z5tr4a91/)

![Dependencies](https://david-dm.org/Zenoo/slick-complete.svg)

Handle your table display asynchronously

### Doc

* **Installation**

Simply import JQuery, those 3 packages & SlickComplete into your HTML.
```

<link rel="stylesheet" href="slick-complete.css">
<script type="text/javascript" src="slick-complete.js"></script>
```
* **How to use**

Create a new [`SlickComplete`](SlickComplete.html) object with a query String or an Element as the first parameter :
```
let slickComplete = new SlickComplete('div.with[any="selector"]', options);
// OR
let element = document.querySelector('li.terally[any="thing"]', options);
let slickComplete = new SlickComplete(element);
```
* **Options**

```
{
  icon: false,                                // Use an icon for your items ?
  lang: 'en',                                 // Language
  items: [                                    // Items list
    {
      id: 'yourID',                           // String or Number
      name: {
          'en': 'Test',                       // 'lang': 'translatedName'
          'fr': 'Tester'
      },
      aliases: ['Test2','Test3'],             // Name aliases
      icon: 'https://website.com/iconurl.jpg' // Icon URL
    },
    ...
  ]
}
```

* **Example**

See this [JSFiddle](https://jsfiddle.net/Zenoo0/z5tr4a91/) for a working example


## Authors

* **Zenoo** - *Initial work* - [Zenoo.fr](http://zenoo.fr)
