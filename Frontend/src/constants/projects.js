export const PROJECT_FORM_INITIAL_STATE = {
    name: '',
    clientName: '',
    description: '',
    timeline: '',
    budget: '',
    projectManager: ''
};

export const PROJECT_FORM_FIELDS = [
    { name: 'name', label: 'Project Name', placeholder: 'e.g. Infrastructure Modernization', required: true },
    { name: 'clientName', label: 'Client Name', placeholder: 'Search or select client', required: true },
    { name: 'description', label: 'Project Overview', placeholder: 'Describe the project scope...', required: true, type: 'textarea' },
    { name: 'timeline', label: 'Expected Timeline', type: 'date', required: true },
    { name: 'budget', label: 'Budget ($)', placeholder: '50,000', type: 'number', required: true },
    { name: 'projectManager', label: 'Assign Project Manager', type: 'select', required: true }
];
