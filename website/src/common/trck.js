let ga;

function install(trackId) {
  if (!ga) {
    ga = (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
      (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
      m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
      return i[r];
    })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

    ga('create', trackId, 'auto');
  }

  return ga;
}

// ga('send', 'pageview');
// UA-2263138-5

export default function trck() {

};
