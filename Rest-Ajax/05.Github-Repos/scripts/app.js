function loadRepos() {

	let btn = document.querySelector("body>button");

	btn.addEventListener("click", btnHandler);

	function btnHandler() {

		let input = document.querySelector("body>input");
		let username = input.value;
		if (username != "") {
		    repoCaller(username);
			input.value = "";
		}
	}
	function repoCaller(repoUser) {
		let url = `https://api.github.com/users/${repoUser}/repos`;

		fetch(url)
			.then((response) => {
				if (response.status === 200) {
					displayRepos(response.json());
				} else {
					displayRepos(undefined, repoUser);
					throw new Error(`No repositories for ${repoUser} found. Server returned: `  + response.status);
				}
			})
			.catch(error => { console.error(error) });
	}

	function displayRepos(promise, repoUser) {

		let ul = document.querySelector("#repos");
		ul.innerHTML = "";

		if (promise) {
			promise.then((data) => data.map(arr => {
				let repo = {};
				repo.fullName = arr.full_name,
					repo.htmlUrl = arr.html_url
				return repo;
			})).then((filteredData) => {
				for (const repo of filteredData) {
					let li = document.createElement("li");
					let a = document.createElement("a");
					a.href = repo.htmlUrl;
					a.innerText = repo.fullName;
					li.appendChild(a);
					ul.appendChild(li);
				}
			})		
		} else {
			let li = document.createElement("li");
			li.innerText = `No repositories for user '${repoUser}' found!`;
			ul.appendChild(li);
		}
	}
}
