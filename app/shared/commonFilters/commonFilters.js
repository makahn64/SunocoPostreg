/**
 * Created by mkahn on 12/4/14.
 */

/**
 *
 * Just a pile of useful Angular filters
 *
 */

app.filter('numberFixedLen', function () {
        return function (n, len) {
            var num = parseInt(n, 10);
            len = parseInt(len, 10);
            if (isNaN(num) || isNaN(len)) {
                return n;
            }
            num = ''+num;
            while (num.length < len) {
                num = '0'+num;
            }
            return num;
        };
    });

app.filter('sniff', function () {
        return function (items, field) {

            console.log("Sniffed: "+field);

            return items;
        };
    });

app.filter('firstInitial', function () {
    return function (n) {

        var rval = n.charAt(0).toUpperCase()+".";
        return rval;
    };
});


app.filter('humanTime', function () {
    return function (item) {
        var d = new Date(item*1000);
        return d.toLocaleString();
    };
});


app.directive('errSrc', function() {
  return {
    link: function(scope, element, attrs) {
      element.bind('error', function() {
        if (attrs.src != attrs.errSrc) {
          attrs.$set('src', attrs.errSrc);
          attrs.$set('style', "visibility: hidden");
        }
      });
    }
  }
});

app.filter('reverse', function() {
  return function(items) {
    return items.slice().reverse();
  };
});

