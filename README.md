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

Create a new `SlickComplete` object with a query String or an Element as the first parameter :
```
let slickComplete = new SlickComplete('div.with[any="selector"]');
// OR
let element = document.querySelector('li.terally[any="thing"]');
let slickComplete = new SlickComplete(element);
```
* **Options**

```
{
  icon: false,             // Use an icon for your items ?
  items: [                 // Items list
    {
      name: [
        {
          'en': 'Test',
          'fr': 'Tester'
        }
      ]
      aliases: ['Test2','Test3'],
      icon: 'https://website.com/iconurl.jpg'
    },
    ...
  ]
}
```

* **Example**

See this [JSFiddle](https://jsfiddle.net/Zenoo0/z5tr4a91/) for a working example


## Authors

* **Zenoo** - *Initial work* - [Zenoo.fr](http://zenoo.fr)
