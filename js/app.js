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
        $('.album-list li').click(displayAlbumDetail);
    }

}

function displayAlbumDetail() {
    const albumID = albumIDs[$('li').index(this)];
    const albumURL = `https://api.spotify.com/v1/albums/${albumID}`;


    $.getJSON(albumURL, (d) => {
        console.log(d);
    });
}

