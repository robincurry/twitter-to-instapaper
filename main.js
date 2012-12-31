document.addEventListener('keyup', function(e) {
    var tag = e.target.tagName.toLowerCase();
    // keycode for 'i' is 73
    // Ignore when composing tweets...
    if (tag == 'input' || tag == 'textarea' || e.keyCode != 73)
        return true;
    var hovered = $('.hovered-stream-item');
    var text = $('.hovered-stream-item .js-tweet-text').text().trim();
    if (hovered.length != 0) {
        // find links
        var links = hovered.find('.twitter-timeline-link');
        var processed = [];
        if (links.length != 0) {
            // send each unique link to instapaper.
            links.each(function(i){
              if ($.inArray(this.href, processed) == -1){
                saveToInstapaper(this.href, text);
                animateSharedLink(this);
                processed.push(this.href);
              }
              return true;
            });
        }
        else {
          // otherwise, send tweet permalink.
          var permalink = hovered.find('.js-permalink')[0];
          if ($.inArray(permalink.href, processed) == -1){
            saveToInstapaper(permalink.href, text);
            animatePermalink(permalink);
            processed.push(permalink.href);
          }
        }
    }
}, true);

function saveToInstapaper(url, text) {
  chrome.storage.local.get("t2i_settings", function(data) {
    settings = data["t2i_settings"];

  $.ajax({
        url: "https://www.instapaper.com/api/add",
        type: 'GET',
        data: {
          url: encodeURI(url),
          selection: text,
          username: settings.username,
          password: settings.pwd
        },
        dataType: 'json'
      }
  );

  });
}

function animateSharedLink(item){
  var txt = $(item).find('.js-display-url')[0];
  animateTextNode(txt);
}

function animatePermalink(item){
  var txt = $(item).find('.js-short-timestamp')[0];
  animateTextNode(txt);
}

function animateTextNode(txt){
  var p = $(txt).parent();
  p.css("position", "relative");
  $(txt).clone()
    .appendTo(p)
    .css("position", "absolute")
    .css("left", "0")
    .animate({
      fontSize: "24px",
      left: "-=100"
      },
      {
        step: function(current, fx){
          if (fx.prop == "left" && current <= -50) {
            $(fx.elem).css("color", "#222");
          }
        }
      })
    .prepend("\u272A&nbsp;")
    .fadeOut('slow', function(){
      $(this).remove();
    });
}
