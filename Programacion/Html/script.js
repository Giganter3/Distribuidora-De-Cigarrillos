function showSection(section) {
    document.getElementById('main-menu').classList.add('hidden');
    document.getElementById(section + '-section').classList.remove('hidden');
}

function showForm(formId) {
    document.querySelectorAll('#' + formId.split('-')[0] + '-section div').forEach(el => el.classList.add('hidden'));
    document.getElementById(formId).classList.remove('hidden');
}

function goBack() {
    document.querySelectorAll('.hidden').forEach(el => el.classList.add('hidden'));
    document.querySelectorAll('#user-section, #admin-section').forEach(el => el.classList.add('hidden'));
    document.getElementById('main-menu').classList.remove('hidden');
}
