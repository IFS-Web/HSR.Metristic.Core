document.addEventListener('DOMContentLoaded', function() {
	var profileSelect = document.getElementById('profile');
	var profileHelpBlock = document.getElementById('profile-help');

	function setHelpText(selectElement, helpBlock) {
		var optionElement = profileSelect.querySelector('option[value="'+selectElement.value+'"]');
		helpBlock.innerText = optionElement.getAttribute('data-description');
	}

	if(profileSelect && profileHelpBlock) {
		profileSelect.addEventListener('change', function() {
			setHelpText(profileSelect, profileHelpBlock);
		});
		setHelpText(profileSelect, profileHelpBlock);
	}
});