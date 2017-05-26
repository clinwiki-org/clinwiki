var filterStorage = {};

$('#search-view').ready(function() {
  $('.agg').each(function(i, ele){ filterStorage[$(ele).data('filter')] = {}; })

  var table = $('#sortTable');
  var dt = table.DataTable({
    "oLanguage": { "sSearch": "Filter results" },
    "lengthMenu": [ 25, 50, 75, 100 ],
    "pageLength": 25,
    "ajax": {
      "url": $('#search-view').data('searchurl'),
      "data": function(d) {
        // idk why we can't just set json, but whatever
        d.agg_filters = JSON.stringify(filterStorage);
        return d;
      },
      "type": "POST",
    },
    "processing": true,
    "serverSide": true,
    "columns": [
      {"data": "nct_id", render: function(data, type, row) {
        return "<a href=\"/studies/"+row.nct_id+"\" target=\"_blank\">"+data+"</a>";
      }},
      {"data": "rating", render: function(data, type, row) {
        return "<span style=\"display: none;\">"+data+"</span><div class=\"star-rating\" data-score="+data+"></div>";
      }},
      {"data": "status"},
      {"data": "title", render: function(data, type, row) {
        return "<a href=\"/studies/"+row.nct_id+"\" target=\"_blank\">"+data+"</a>";
      }},
      {"data": "started"},
      {"data": "completed"}
    ]
  });
  table.on('draw.dt', function(){
    $(".star-rating").raty({
       path: '/assets/',
       readOnly: true,
       score: function() {
         return $(this).attr('data-score');
       }
    });
  });
  table.on('xhr.dt', function(e, settings, data) {
    if(!data) {
      return;
    }
    var ratingSelect = $('.rating-agg');
    ratingSelect.empty().append($('<option>Rating...</option>'));
    data.aggs.average_rating.buckets.map(function(bucket) {
      ratingSelect.append($('<option value="'+bucket.key+'">'+(bucket.key)+' ('+bucket.doc_count+')</option>'));
    });

    var updateTextSelect = function(ele) {
      var first = ele.find('option').first();
      ele.empty().append(first);
      data.aggs[ele.data('agg')].buckets.map(function(bucket) {
        ele.append($('<option value="'+bucket.key+'">'+(bucket.key)+' ('+bucket.doc_count+')</option>'));
      });
    };

    $('select.text-agg').each(function(i, ele) {
      updateTextSelect($(ele));
    });

    var updateDateSelect = function(ele) {
      var first = ele.find('option').first();
      ele.empty().append(first);
      data.aggs[ele.data('agg')].buckets.map(function(bucket) {
        var dt = new Date(bucket.key);
        if (bucket.doc_count == 0) {
          return;
        }
        ele.append($('<option value="'+bucket.key+'">'+(dt.getFullYear())+' ('+bucket.doc_count+')</option>'));
      });
    };

    $('select.date-agg').each(function(i, ele) {
      updateDateSelect($(ele));
    });

    $('select').on('change', function() {
      var ele = $(this);
      var firstOption = ele.find('option:first');
      var title = firstOption.text().replace('...', '');
      var option = $(ele.find(':selected'));
      var selectedText = title + ': ' + option.text().replace(/\(\d+\)$/, '');
      var selectedValue = ele.val();
      if (firstOption.val() === selectedValue) {
        return;
      }
      if (! filterStorage[ele.data('filter')][selectedValue]) {
        filterStorage[ele.data('filter')][selectedValue] = 1;
        $('#agg-filters-selected').append(
          $("<span data-filter=\""+ele.data('filter')+"\" class=\"active-filter label label-default\" data-val=\""+selectedValue+"\">"+selectedText+"<span class=\"glyphicon glyphicon-remove\"></span></span>")
        )
      }
      ele.val(firstOption.val());
      dt.ajax.reload();
    });

    $('#agg-filters-selected').on('click', '.active-filter', function() {
      var ele = $(this);
      delete filterStorage[ele.data('filter')][ele.data('val')];
      ele.remove();
      dt.ajax.reload();
    });

  });
});
