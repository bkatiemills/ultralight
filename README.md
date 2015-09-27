# ultralight

Ultralight is a simple tool to help novice web developers make simple client-side web apps that have stateful URLs, basic templating, and *that's it*. You can see a demo of Ultralight in action right here on the [gh-pages branch](http://billmills.github.io/ultralight/index.html?cats=1).

**[Testing status](http://billmills.github.io/ultralight/tests/tests.html)**

**Please cite v0.1 (current release) via:** [![DOI](https://zenodo.org/badge/3877/BillMills/ultralight.svg)](https://zenodo.org/badge/latestdoi/3877/BillMills/ultralight)

Version History:

version | DOI
--------|-------
v0.1    | 10.5281/zenodo.31471

## Why are we doing this?

Scientists are beginning to realize the power and convenience of sharing tools and analyses via simple web apps. But, most labs don't have the budget to hire a full-time web developer, and most scientists are not web developers. As such, the powerful professional frameworks out there often produce products that are too cumbersome to maintain.

Ultralight seeks to allow users with a casual commitment to web development to make simple applications that nonetheless capture a few best practices, like html templates and meaningful URLs.

## Usage

Ultralight tries to make templating and encoding information in the query string as simple as possible; `index.html`, `auxData.js`, `partials/picture.mustache` along with the cat photos in `img/` form a [complete working example](http://billmills.github.io/ultralight/index.html?cats=1); the key elements of which are as follows:

### Minimal Usage

 - **1. Import dependencies.** Cut and paste into your web page's `<head>`:

```
<script src='https://cdn.rawgit.com/janl/mustache.js/master/mustache.js' type="text/javascript"></script>
<script src='ultralight.js' type="text/javascript"></script>
```

 - **2. Describe your page in plain HTML + mustache templates.** In the `<head>`, in a `<script id="body" type="text/template">` tag, write out the HTML for your page. You can use nothing but plain HTML if you like, or you can mix in powerful [mustache.js templates](https://github.com/janl/mustache.js/#templates); see the link for an explanation of how to use mustache. **Variables will be automagically imported from the query string!** So, if I write a template:

```
<script id="body" type="text/template">
    <p> I have {{cats}} cats. </p>
</script>
```

and I visit my page at `whateverURL.org?cats=17`, my page will read 'I have 17 cats.'

 - **3. Initialize Ultralight.** Cut and paste into `<head>`:

```
<script type='text/javascript'>
    ul = new ultralight([])
    ul.fetchTemplates();
</script>
```
 
 and you're good to go!

### Slightly Less Minimal Usage

Ultralight has three more key features to help you build simple web apps: partial wrapping, auxilary data, and a rendering callback.

 - **Partial wrapping** makes it easy to mix in mustache templates from other files, to keep your project modular, organized and reusable. In order to make a partial template, create a file in the `partials/` directory beside your main html file:

`partials/header.mustache`:
```
<div>
    <h1> My Awesome Cat Page </h1>
    <h3> By Caterina Catniss</h3>
</div>
```

Note the file must be in the `partials/` directory and must end in `.mustache`. Then, add the name of this partial to the array in the first argument to Ultralight during setup:

```
 <script type='text/javascript'>
     ul = new ultralight(['header'])
     ul.fetchTemplates();
 </script>
```

Now, you can include this chunk of html in your original template like so:

```
<script id="body" type="text/template">
    {{> header}}
    <p> I have {{cats}} cats. </p>
</script>
```

note you can have as many pages in your main directory as you like; with partials, you can write the HTML that is common between them *once*, and include it as per the above example in any or all of them.

 - **Auxilary data** is sometimes necessary in addition to the data found in the query string; this could be results of a calculation, information looked up from a table, etc. In order to add more variables to your mustache templates, define a function that takes as its sole argument the query string information as a JavaScript object, and returns another object whose keys are the variable names you'd like to expose to mustache, along with their corresponding values:

```
function auxilaryData(queryData){
    var catIDnumber = queryData.catNo;                    //would be '3' if the url was whateverURL.org?catNo=3
    catIDnumber = parseInt(catIDnumber);                  //note all query string variables arrive as strings!
    var namesOfCats = ['Pika', 'Pixel', 'Kiki', 'Grom'];  //some extra data
    
    return {name: namesOfCats[catIDnumber % 4]}
}
```

pass this function to the Ultralight contstructor's second argument:

```
 <script type='text/javascript'>
     ul = new ultralight(['header'], auxilaryData)
     ul.fetchTemplates();
 </script>
```

Your templates will now be able to use the `{{name}}` variable, which will contain whatever you assigned to that key in the object returned by `auxilaryData`.

 - **Rendering callbacks** are useful if you want to do something once Ultralight has finished setting up your page. This can be any JavaScript function you like, which will be called with no arguments after Ultralight is finished. Pass the name of the callback function into the third argument of Ultralight's constructor:

```
 <script type='text/javascript'>
     ul = new ultralight(['header'], auxilaryData, renderCallback)
     ul.fetchTemplates();
 </script>
```

## Contributing

Ultralight is a simple sketch at the moment. A huge help would be to open an issue with your comments or ideas, or participate in one of the ongoing conversation there.

## Thanks

The templating half of ultralight is nothing but [mustache.js](https://github.com/janl/mustache.js/) - big thanks to that team!

This work is supported by the [GRIFFIN Collaboration](https://github.com/GRIFFINCollaboration) at TRIUMF, Canada's national lab for nuclear & particle physics.
