jQuery(function($) {

	var team = [
		{
			employeeName: 'Tim Sweigart',
			position: 'CEO',
			emailAddress: 'tim@kansaselectric.com',
			employeePicture: 'tim-sweigart',
			employeeBio: 'Bio here...',
		},
		{
			employeeName: 'Steve Rogers',
			position: 'COO',
			emailAddress: 'steve@kansaselectric.com',
			employeePicture: 'steve-rogers',
			employeeBio: 'Bio here...',
		},
		{
			employeeName: 'Garrett Butler',
			position: 'Lead Project Manager',
			emailAddress: 'garrett@kansaselectric.com',
			employeePicture: 'garrett-butler',
			employeeBio: 'Bio here...',
		},
		{
			employeeName: 'Jared Smith',
			position: 'Sales/Project Manager',
			emailAddress: 'jared@kansaselectric.com',
			employeePicture: 'jared-smith',
			employeeBio: 'Bio here...',
		},
		{
			employeeName: 'Scott Burns',
			position: 'Service Manager',
			emailAddress: 'scott@kansaselectric.com',
			employeePicture: 'scott-burns',
			employeeBio: 'Bio here...',
		},
		{
			employeeName: 'Shane Jeffery',
			position: 'Project Manager',
			emailAddress: 'shane@kansaselectric.com',
			employeePicture: 'shane-jeffery',
			employeeBio: 'Bio here...',
		},
		{
			employeeName: 'Brody Machmer',
			position: 'Project Manager',
			emailAddress: 'brody@kansaselectric.com',
			employeePicture: 'brody-machmer',
			employeeBio: 'Bio here...',
		},
		{
			employeeName: 'Kevin Moore',
			position: 'Estimator',
			emailAddress: 'kevin@kansaselectric.com',
			employeePicture: 'kevin-moore',
			employeeBio: 'Bio here...',
		},
		{
			employeeName: 'Derek Madsen',
			position: 'Estimator',
			emailAddress: 'derek@kansaselectric.com',
			employeePicture: 'person-placeholder',
			employeeBio: 'Bio here...',
		},
		{
			employeeName: 'Landon Cooper',
			position: 'Logistics & Purchasing',
			emailAddress: 'landon@kansaselectric.com',
			employeePicture: 'landon-cooper',
			employeeBio: 'Bio here...',
		},
		{
			employeeName: 'Corey Ingalls',
			position: 'Safety Manager',
			emailAddress: 'corey@kansaselectric.com',
			employeePicture: 'corey-ingalls',
			employeeBio: 'Bio here...',
		},
		{
			employeeName: 'Peter Jantzen',
			position: 'Operations Manager',
			emailAddress: 'peter@kansaselectric.com',
			employeePicture: 'peter-jantzen',
			employeeBio: 'Bio here...',
		},
		{
			employeeName: 'Marc Friesen',
			position: 'Finance Director',
			emailAddress: 'marc@kansaselectric.com',
			employeePicture: 'marc-friesen',
			employeeBio: 'Bio here...',
		},
		{
			employeeName: 'Deb Meyer',
			position: 'Office Manager',
			emailAddress: 'deb@kansaselectric.com',
			employeePicture: 'deb-meyer',
			employeeBio: 'Bio here...',
		},
		{
			employeeName: 'Ann Koehn',
			position: 'Office & Marketing Specialist',
			emailAddress: 'ann@kansaselectric.com',
			employeePicture: 'ann-koehn',
			employeeBio: 'Bio here...',
		},
	];

	function getTeamMemberIndex(emName) {
		for(var i = 0; i < team.length; i++) {
			if(emName === team[i].employeeName) {
				return i;
			}
		}
	}

	function closeModal() {
		$('#close').on('click', function(e) {
			e.preventDefault();
			$('#bio-overlay').addClass('hidden');
			// resume normal scrolling functionality
			$('body').css('overflow', 'auto');
		});
	};

	function openModal(emName) {
		var employeeIndex = getTeamMemberIndex(emName);

		var bioHTML = '<div class="md:flex md:justify-between md:space-x-8">';
				bioHTML += '<div class="w-5/6 mx-auto md:w-2/5 p-6">';
				bioHTML += '<img class="rounded-full" src="/assets/img/team/' + team[employeeIndex].employeePicture + '.jpg" alt="' + team[employeeIndex].employeeName + '" width="400" height="400">';
				bioHTML += '</div>';
				bioHTML += '<div class="md:w-3/5 md:self-center">';
				bioHTML += '<div class="pb-8 mb-8 border-b border-ke-gray-light text-center md:text-left">';
				bioHTML += '<h2 class="font-semibold text-xl leading-tight">' + team[employeeIndex].employeeName + '</h2>';
				bioHTML += '<p class="text-lg text-ke-gray mb-4">' + team[employeeIndex].position + '</p>';
				bioHTML += '<a href="mailto:' + team[employeeIndex].emailAddress + '" class="inline-block font-semibold text-ke-blue hover:text-ke-blue-dark hover:translate-x-2 transform transition duration-200 ease-in-out">' + team[employeeIndex].emailAddress + '</a>';
				bioHTML += '</div>';
				bioHTML += '<p class="text-ke-gray">' + team[employeeIndex].employeeBio + '</p>';
				bioHTML += '</div>';
				bioHTML += '</div>';

		$('#bio-modal').html(bioHTML);

		$('#bio-overlay').removeClass('hidden');
	}


	$('a.team-member').on( 'click', function(e) {
		// stop event from being fired multiple times
		e.stopImmediatePropagation();
		e.preventDefault();

		var etarget = e.target.closest('a');

		// stop scrolling when modal is open
		$('body').css('overflow', 'hidden');

		openModal($(etarget).data('name'));

		// enable the modal close button
		closeModal();


	});

});