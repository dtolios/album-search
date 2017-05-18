const albumIDs = [];

$('form').submit((submitEvent) => {

    submitEvent.preventDefault();

    getSearchData();

}); // end submit

function getSearchData() {

    const searchURL = 'https://api.spotify.com/v1/search';
    const searchResult = $('#search').val();
    const requestParameters = { q: searchResult, type: 'album' };
    $.getJSON(searchURL, requestParameters, displayAlbums);

}

function displayAlbums(d) {

    let albumHTML = '';
    if(0 === d.albums.items.length) {
        const searchResult = $('#search').val();
        albumHTML += `<li class='no-albums desc'><i class='material-icons icon-help'>help_outline</i>No albums found that match: ${searchResult}.</li>`;
        $('#albums').html(albumHTML);
    }
    else {
        $.each(d.albums.items, (i, album) => {
            albumIDs.push(album.id);
            albumHTML += `<li><div class="album-wrap"><img class="album-art" src="${album.images[0].url}"></div>`;
            albumHTML += `<span class="album-title">${album.name}</span>`;
            albumHTML += `<span class="album-artist">${album.artists[0].name}</span></li>`;
        });
        $('#albums').html(albumHTML);
        $('.album-list li').click(getAlbumData);
    }

}

function getAlbumData() {
    const albumID = albumIDs[$('li').index(this)];
    const albumURL = `https://api.spotify.com/v1/albums/${albumID}`;
    $.getJSON(albumURL, displayAlbumDetail);
}

function displayAlbumDetail(d) {
    const $albums = $('.main-content');
    $albums.remove();

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

    $('#back-button').click(() => {
        backToResults($albums);
    });
}

function backToResults($albums) {
    $('.color-band').remove();
    $('.main-content').remove();
    $('.main-header').after($albums);
    $('.album-list li').click(getAlbumData);
}
