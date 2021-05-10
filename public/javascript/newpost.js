async function postFormHandler(event) {
    event.preventDefault();

    const post_text = document.querySelector('textarea[id="newpost-text"]').value.trim();
    const title = document.querySelector('#newpost-title').value.trim();


    if (post_text && title) {
        const response = await fetch('/api/posts', {
            method: 'POST',
            body: JSON.stringify({
                title,
                post_text
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            document.location.replace('/home');
        } else {
            alert(response.statusText);
        }
    }
}


document.querySelector('#newpost-form').addEventListener('submit', postFormHandler);