$(function(){
  $('.hidden').hide();

  $('#scrape_url').keyup(function(event){
    if (event.keyCode == 32){
      url = linkify($(this).val());
      if (url != null && url.length > 0)
        scrapUrl(url.toString());
    }
  });

  $('#scrape_url').bind('paste', function () {
      var url;
      setTimeout(function () {
        url = linkify($('#scrape_url').val());
        if (url != null && url.length > 0)
          scrapUrl(url.toString());
      }, 100);
  });

  function linkify(inputText) {
    var replacedText, replacePattern1, replacePattern2, replacePattern3;

    //URLs starting with http://, https://, or ftp://
    replacePattern1 = /((https?|ftp):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gim;
    replacedText = inputText.replace(replacePattern1, '$1');

    //URLs starting with "www." (without // before it, or it'd re-link the ones done above).
    replacePattern2 = /(^|[^\/])(www\.[\S]+(\b|$))/gim;
    replacedText = replacedText.replace(replacePattern2, 'http://$2');

    url = replacedText.match(replacePattern1);

    // console.log(replacedText);
    // console.log(url);
    return(url);
  }

  function scrapUrl(url){
    $.ajax({
      url: "/scrape_url",
      data: {
        url: url,
      },
      type: 'post',
      success: function(data){
        var container = document.createElement('div');
        container.className = "scraped_content";
        $('#scrape_url').after(container);
        
        console.log(data);
        
        //Check if a video is present
        if(data.video != undefined)
          alert("video pending");
        else if(data.image.length > 0)
        { 
          image_slider = document.createElement('div');
          image_slider.setAttribute("id", "image_slider");
          bjqs_ul = document.createElement('ul');
          bjqs_ul.className = "bjqs"
          $(image_slider).append(bjqs_ul);
          $('.scraped_content').append(image_slider);

          if(data.image instanceof Array) {
            for(image in data.image){
              if(data.image[image].match("//") == undefined) 
                $(".scraped_content #image_slider ul.bjqs").append("<li><img src=" + url + data.image[image] + "><img></li>");
              else
                $(".scraped_content #image_slider ul.bjqs").append("<li><img src=" + data.image[image] + "><img></li>");
            }
          } else if(data.image != null) {
              if(data.image.match("//") == undefined) 
                $(".scraped_content #image_slider ul.bjqs").append("<li><img src=" + url + data.image + "><img></li>");
              else
                $(".scraped_content #image_slider ul.bjqs").append("<li><img src=" + data.image + "><img></li>");
          }
          init_slider();
        }

        //Add the title container
        title = document.createElement('input');
        title.setAttribute("type", "text");
        title.setAttribute("value", data.title);                
        $('.scraped_content').append(title);

        //Add the description container
        description = document.createElement('textarea');
        if(data.description.length > 0)
          $(description).append(data.description);
        else
          description.setAttribute("placeholder", "This webpage doesn't provide any description. Go ahead and write your own.");                
        $('.scraped_content').append(description);
      }
    });
  }

  function init_slider(){
    $('.scraped_content #image_slider').bjqs({
      'height' : 100,
      'width' : 170,
      'responsive' : true,
      'showmarkers' : false,
    });
  };

});