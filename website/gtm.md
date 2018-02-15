## GA Tag in GTM

```html
<script>
(function(win,doc,o,g,id,a,m,ga,gp){win['GoogleAnalyticsObject']=id;ga=win[id]=win[id]||function(){
  (ga.q=ga.q||[]).push(arguments)},ga.l=1*new Date();a=doc.createElement(o),
  m=doc.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)

  gp = ga.gp || function() {return location.pathname + location.search  + location.hash}

  ga('create', '{{GA_ID}}', 'auto')

  function d() {
    ga('set', 'page', gp())
    ga('send', 'pageview')
  }

  d()
})(window,document,'script','https://www.google-analytics.com/analytics.js','ga')
</script>
```

## Load GTM in Code

```js
installGtm(id)
```
