$(document).ready(
  function() {
    $("div.sub-summary-area.row div.span3").click(
      function() {
        var id = $(this).attr('id');

        switch (id) {
          case 'JEEP_AREA':
            window.location.href = '/jeeps';
            break;
          case 'LINE_AREA':
            window.location.href = '/voters';
            break;
          case 'VOTER_AREA':
            window.location.href = '/prizes';
            break;
          default:
            break;
        }
      }
    );
  }
);