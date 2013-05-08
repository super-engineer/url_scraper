//= require bjqs

$(function(){
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

        //Add cross button
        cross_button = document.createElement('a');
        cross_button.className = "delete_node";
        cross_button.innerHTML = "X";
        $('.scraped_content').append(cross_button);

        //Add the title container
        title = document.createElement('div');
        title.className = "scraped_title";
        title_input_field = document.createElement('input');
        title_input_field.setAttribute("type", "text");
        title_input_field.setAttribute("value", data.title);
        title_span = document.createElement('span');
        title_span.innerHTML = data.title;
        title.appendChild(title_input_field);
        title.appendChild(title_span);
        $('.scraped_content').append(title);
        $(title_input_field).hide();

        //Add the description container
        if(data.description != null && data.description.length > 0){
          description = document.createElement('div');
          description.className = "scraped_description";
          description_textarea = document.createElement('textarea');
          description_textarea.innerHTML = data.description;
          description_span = document.createElement('span');
          description_span.innerHTML = data.description;
          description.appendChild(description_textarea);
          description.appendChild(description_span);
          $('.scraped_content').append(description);
          $(description_textarea).hide();          
        }
        // else
        //   description_textarea.setAttribute("placeholder", "This webpage doesn't provide any description. Go ahead and write your own.");
      }
    });
  }

  $(document).on("click", function(e){
    $(".scraped_content span").show();
    $(".scraped_content span").siblings().hide();
  });

  $(document).on("click", ".scraped_content textarea, .scraped_content input", function(e){
    e.stopPropagation();
  });

  $(document).on("click", ".scraped_content span", function(e){
    $(this).parents('div').find('input, textarea').hide();
    $(this).parents('div').find('span').show();
    $(this).hide();
    $(this).siblings().show();
    e.stopPropagation();
  });

  $(document).on("change", ".scraped_content .scraped_title input", function(){
    $(this).siblings('span').html($(this).val());
  });

  $(document).on("change", ".scraped_content .scraped_description textarea", function(){
    setTimeout(function () {
      $(this).siblings('span').html($(this).html());
    }, 100);
  });
  
  function init_slider(){
    $('.scraped_content #image_slider').bjqs({
      'height' : 110,
      'width' : 170,
      'responsive' : true,
      'showmarkers' : false,
      'centercontrols' : false,
      'nexttext' : '>', // Text for 'next' button (can use HTML)
      'prevtext' : '<', // Text for 'previous' button (can use HTML)
    });
  };

});
