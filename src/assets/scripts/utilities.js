document.addEventListener('DOMContentLoaded', function() {
	var printLink = document.getElementById('print');
	if(printLink) {
		printLink.addEventListener('click', function() {
			window.print();
		});
	}
});