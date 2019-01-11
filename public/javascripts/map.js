function initMap() {
    var pos1 = {lat: 11.060420, lng: 106.796341};
    var pos2 = {lat: 16.054407, lng: 108.202164};
    var pos3 = {lat: 12.238791, lng: 109.196747};

    // Create a map object and specify the DOM element
    // for display.
    var map = new google.maps.Map(document.getElementById('map'), {
      center: pos2,
      zoom: 5
    });

    // Create a marker and set its position.
    const mapMarker = (map, pos, title)=>{
        var marker = new google.maps.Marker({
          map: map,
          position: pos,
          title: title
        });
        return marker    
    }

    mapMarker(map, pos1, 'co so 1');
    mapMarker(map, pos2, 'co so 2');
    mapMarker(map, pos3, 'co so 3');
    
  }