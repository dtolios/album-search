(function(){

    // global variable to hold album IDs for easy access
    let albumIDs = [];

    // On form submit (the search field), prevent the default,
    // and instead send a GET request to the Spotify API
    $('form').submit((submitEvent) => {
        submitEvent.preventDefault();
        albumIDs = []; // Every time form is submitted, reset the array to empty
        $('.color-band').remove();
        $('.main-content').remove();
        getSearchData();
    });

    // EFFECTS: Sends an AJAX request to the Spotify API's search endpoint.
    //          Successful requests will callback displayAlbums
    function getSearchData() {
        const searchURL = 'https://api.spotify.com/v1/search';
        const searchResult = $('#search').val();
        const requestParameters = { q: searchResult, type: 'album' };
        $.getJSON(searchURL, requestParameters, displayAlbums).fail(() => {
            $('.main-header').after('<div class="main-content clearfix"><ul id="albums" class="album-list"><li class="desc"><i class="material-icons icn-album">album</i>Search for your favorite albums!</li></ul></div>');
        });
    }

    // REQUIRES: d must be data received from Spotify API's search endpoint of type 'album'
    // MODIFIES: replaces the html within #albums
    // EFFECTS:  uses the album search data to populate a grid of album art and descriptions.
    //           If no albums are found, displays a nice error to the user.
    function displayAlbums(d) {
        let albumHTML = '<div class="main-content clearfix"><ul id="albums" class="album-list">';

        // check for no results
        if(0 === d.albums.items.length) {
            const searchResult = $('#search').val();
            albumHTML += `<li class='no-albums desc'><i class='material-icons icon-help'>help_outline</i>No albums found that match: ${searchResult}.</li></ul></div>`;
            $('.main-header').after(albumHTML);
        }
        else {
            $.each(d.albums.items, (i, album) => {
                albumIDs.push(album.id);
                albumHTML += `<li><div class="album-wrap"><img class="album-art" src="${album.images[0].url}"></div>`;
                albumHTML += `<span class="album-title">${album.name}</span>`;
                albumHTML += `<span class="album-artist">${album.artists[0].name}</span></li>`;
            });
            albumHTML += '</ul></div>';
            $('.main-header').after(albumHTML);
            // add click event listener to each album result. Call getAlbumData onclick
            $('.album-list li').click(getAlbumData);
        }
    }

    // REQUIRES: must be called from event listener on a set of album list items
    // MODIFIES: n/a
    // EFFECTS:  sends an AJAX request to the Spotify API's albums endpoint with the corresponding Album ID of the
    //           album the user selected
    function getAlbumData() {
        const albumID = albumIDs[$('li').index(this)]; // In this context, this is the list item the user clicked
        const albumURL = `https://api.spotify.com/v1/albums/${albumID}`;
        $.getJSON(albumURL, displayAlbumDetail);
    }

    // REQUIRES: Data must be received from the Spotify API's albums endpoint
    // MODIFIES: replaces the html of .main-content with an album detail page
    // EFFECTS:  removes the grid of album results and adds album detail page html to the page
    function displayAlbumDetail(d) {
        // remove albums grid
        const $albums = $('.main-content');
        $albums.remove();

        // construct the album detail page html
        let albumDetailHTML = '';
        albumDetailHTML += '<div class="color-band"></div>';
        albumDetailHTML += '<div class="main-content"><div class="album-details"><div class="left-column">';
        albumDetailHTML += '<button id="back-button">&lsaquo; Search results</button><div class="album-art">';
        albumDetailHTML += `<img src=${d.images[0].url}></div></div>`;
        albumDetailHTML += `<div class="right-column"><h2>${d.name}` + ` (${d.release_date})</h2>`;
        albumDetailHTML += `<h3>${d.artists[0].name}</h3>`;
        albumDetailHTML += '<div id="track-list"><p>track list:</p><ol>';
        $.each(d.tracks.items, (i, track) => {
            albumDetailHTML += `<li>${track.name}</li>`;
        });
        albumDetailHTML += '</ol></div></div></div></div>';
        $('.main-header').after(albumDetailHTML);

        // add event listener for the back to search results button.
        $('#back-button').click(() => {
            backToResults($albums);
        });
    }

    // REQUIRES: must be called from the album detail page
    // MODIFIES: replaces the html of .main-content with the search results
    // EFFECTS:  the user sees the album search results they originally requested
    function backToResults($albums) {
        $('.color-band').remove();
        $('.main-content').remove();
        $('.main-header').after($albums);
        $('.album-list li').click(getAlbumData);
    }
}());