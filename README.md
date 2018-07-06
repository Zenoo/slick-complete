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
  source: false,           // URL used to fetch the data. Set to false to disable AJAX loading
  sourceContext: {},       // Optional object to pass to the server while fetching the data
  printButtons: true,      // Should the print buttons be displayed?
  orderBy: 0,              // Index of the column used to order the table
  orderSort: 'desc',       // Order direction
  logging: false,          // Should ajaxTable use the developper console?
  onReady: function (table, data) { },     // Runs when the ajaxTable is ready
  beforeAjax: function (table, data) { },  // Runs before every AJAX call
  onUpdate: function (table, data) { }     // Runs after every table update
}
```

* **Server configuration**

If you use the ajax functionality, you'll need to setup your server to correctly answer to the AJAX calls.  
The data sent from your server should be a valid JSON like this :
```
{
  "data":[
    "<tr><td>first</td><td>second</td><td>third</td></tr>",
    "<tr><td>first 2</td><td>second 2</td><td>third 2</td></tr>",
    "<tr><td>first 3</td><td>second 3</td><td>third 3</td></tr>"
  ],
  "total":2
}
```

The `data` property contains an Array of Strings representing each `<tr>`.  
The `total` property contains the total amount of lines in your table.

The data passed through the AJAX request looks like this
```
{
  page: 2,                    // The page to be displayed. Here, since we want page 2, we need the items in the range [11 - 20]
  orderBy: 1,                 // The index of the column the table is being ordered by. (Zero-based)
  order: "asc",               // Order sort. 'asc' or 'desc'
  search: ['','','test',''],  // The array containing the values of the search inputs
  columns: 4,                 // The number of columns in the table
  total: true,                // OPTIONAL: if set to TRUE, you should send the property `total` back
  context: {                  // The object from the `sourceContext` parameter
    test: 'test1',
    ...
  }
}
```

* **Example**

See this [JSFiddle](https://jsfiddle.net/Zenoo0/z5tr4a91/) for a working example


* **PHP server code sample**

Here is a sample of what the server-side PHP code could look like
```
if(isset($_POST['total']) || isset($_POST['page'])){
    $return = array();

    $page = isset($_POST['page']) ? (int)$_POST['page'] : 1;
    $search = isset($_POST['search']) ? $_POST['search'] : array_fill(0, (int)$_POST['columns'], "");
    $orderIndex = isset($_POST['orderBy']) ? $_POST['orderBy'] : 0;
    $order = isset($_POST['order']) ? $_POST['order'] : 'desc';
    $context = $_POST['context']

    $currentData = getItems($page, $search, $orderIndex, $order, $context);  // Get your items here
    $currentTotal = getTotalItems($search, $context);                        // Get the total number of items here

    $return['data'] = $currentData;

    if(isset($_POST['total']) && $_POST['total'] == 'true'){
        $return['total'] = $currentTotal;
    }

    echo json_encode($return);
}
``` 

## Authors

* **Zenoo** - *Initial work* - [Zenoo.fr](http://zenoo.fr)
