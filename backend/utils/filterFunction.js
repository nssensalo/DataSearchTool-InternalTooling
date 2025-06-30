
//a helper function for the filtering feature
const applyFilters = (data, filters) => {
    let filteredData = [...data];

    if (filters.startDate) {
        filteredData = filteredData.filter(voter =>
            voter.registration_date >= filters.startDate
        );
    }
    if (filters.endDate) {
        filteredData = filteredData.filter(voter =>
            voter.registration_date <= filters.endDate
        );
    }
    if (filters.selectedParty && filters.selectedParty !== 'All') {
        filteredData = filteredData.filter(voter =>
            voter.party_affiliation === filters.selectedParty
        );
    }
    if (filters.selectedStatus && filters.selectedStatus !== 'All') {
        filteredData = filteredData.filter(voter =>
            voter.voter_status === filters.selectedStatus
        );
    }
    if (filters.voterIdsInput) {
        const ids = filters.voterIdsInput.split(',').map(id => id.trim()).filter(Boolean);
        if (ids.length > 0) {
            filteredData = filteredData.filter(voter =>
                ids.includes(voter.voter_id)
            );
        }
    }
    if (filters.zipCodesInput) {
        const zips = filters.zipCodesInput.split(',').map(zip => zip.trim()).filter(Boolean);
        if (zips.length > 0) {
            filteredData = filteredData.filter(voter =>
                zips.includes(voter.zip_code)
            );
        }
    }
    return filteredData;
};
module.exports=applyFilters