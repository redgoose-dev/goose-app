import $ from 'cash-dom';
import * as util from './util';

/**
 * initial like button
 */
function initLikeButton()
{
  const $button = $('#button_like');
  $button.on('click', function() {
    $button.prop('disabled', true);
    // request like
    util.ajax(`/like/${window.app.srl}/`, 'post')
      .then(function(res) {
        try
        {
          res = JSON.parse(res);
          if (!res.success) throw 'error';
          $button.find('em').text(res.data.star);
          util.setCookie(`goose-star-${window.app.srl}`, '1', 7, window.app.url);
        }
        catch(e)
        {
          $button.prop('disabled', false);
          alert('Error update like');
        }
      })
      .catch(function(error) {
        $button.prop('disabled', false);
        alert('Error update like');
      });
    console.log('on click');
  });
}

export default function()
{
  initLikeButton();
}
