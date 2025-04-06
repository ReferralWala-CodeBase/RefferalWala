const axios = require('axios');
const RapidInternship = require('../models/RapidInternship');  // Ensure your model path is correct

async function fetchData(start) {
  const options = {
    method: 'GET',
    url: 'https://linkedin-data-api.p.rapidapi.com/search-jobs-v2',
    params: {
      keywords: 'Internships',
      locationId: '102713980',
      datePosted: 'pastWeek',
      start: start.toString(),
      sort: 'mostRelevant',
    },
    headers: {
        'x-rapidapi-key': '6f8b59e1fcmsh453807decf6cf37p18580djsne726920872f3',
        'x-rapidapi-host': 'linkedin-data-api.p.rapidapi.com',
    },
  };

  try {
    const response = await axios.request(options);
    return response.data.data ? response.data.data : []; 
  } catch (error) {
    console.error('Error fetching data:', error);
    return [];
  }
}

async function getRapidInternships(req, res) {
  let start = 0; 
  const limit = 4; 
  let allRapidInternships = []; 

  try {
    // Fetch multiple pages by incrementing the 'start' value
    for (let i = 0; i < limit; i++) {
     
      const rapidInternships = await fetchData(start); 
   

      if (rapidInternships && rapidInternships.length > 0) {
        allRapidInternships = allRapidInternships.concat(rapidInternships); // Append internships to the list
      }

      start += 50; // Increase the start value for pagination
    }

    // If there are internships to insert, do so into MongoDB
    if (allRapidInternships.length > 0) {
      await RapidInternship.insertMany(
        allRapidInternships.map(internship => ({
          internshipId: internship.id,
          title: internship.title,
          url: internship.url,
          referenceId: internship.referenceId,
          posterId: internship.posterId,
          company: {
            name: internship.company?.name || 'N/A', 
            logo: internship.company?.logo || 'N/A',
            url: internship.company?.url || 'N/A', 
            
          },
          location: internship.location || 'N/A', 
          type: internship.type || 'N/A',
          postDate: internship.postAt || 'N/A', 
          benefits: internship.benefits || 'N/A', 
        }))
      );

   
    }

    res.json({
      success: true,
      message: 'Internships successfully fetched and stored',
      data: allRapidInternships,
    });
  } catch (err) {
    console.error('Error during rapid internship aggregation or insertion:', err);
    res.status(500).json({
      success: false,
      message: 'Error occurred while fetching or saving rapid internships',
    });
  }
}




async function replaceLast100RapidInternships(req, res) {
    try {
      // Delete the last 100 records from the RapidInternship collection
      const deletedInternships = await RapidInternship.find().sort({ _id: -1 }).limit(100); 
      if (deletedInternships.length > 0) {
        await RapidInternship.deleteMany({ _id: { $in: deletedInternships.map(internship => internship._id) } }); 
        
      }
  
      // Fetch new internship data
      let start = 0; // Initial start value
      const limit = 2; // Number of times to paginate (you can adjust this value as needed)
      let newRapidInternships = [];
  
      for (let i = 0; i < limit; i++) {
      
        const rapidInternships = await fetchData(start); // Fetch data for the current 'start' value
        if (rapidInternships && rapidInternships.length > 0) {
          newRapidInternships = newRapidInternships.concat(rapidInternships); // Append new internships to the list
        }
        start += 50; // Increase the start value for pagination
      }
  
      // If new internships are fetched, insert them into MongoDB
      if (newRapidInternships.length > 0) {
        await RapidInternship.insertMany(
          newRapidInternships.map(internship => ({
            internshipId: internship.id,
            title: internship.title,
            url: internship.url,
            referenceId: internship.referenceId,
            posterId: internship.posterId,
            company: {
              name: internship.company?.name || 'N/A',
              logo: internship.company?.logo || 'N/A',
              url: internship.company?.url || 'N/A'
            },
            location: internship.location || 'N/A',
            type: internship.type || 'N/A',
            postDate: internship.postDate || 'N/A',
            benefits: internship.benefits || 'N/A',
          }))
        );
     
      }
  
      // Return success message
      res.json({
        success: true,
        message: 'Last 100 internships replaced successfully',
        data: newRapidInternships,
      });
    } catch (err) {
      console.error('Error during replacing last 100 internships:', err);
      res.status(500).json({
        success: false,
        message: 'Error occurred while replacing the last 100 internships',
      });
    }
  }


  // API to fetch all internships from the database
async function getAllRapidInternships(req, res) {
    try {
      // Fetch all internships from the RapidInternship collection
      const internships = await RapidInternship.find();  
  
      // If internships are found, return them
      if (internships.length > 0) {
        res.json({
          success: true,
          message: 'All internships fetched successfully',
          data: internships, 
        });
      } else {
        res.json({
          success: true,
          message: 'No internships found in the database',
          data: [],  // Return an empty array if no internships are found
        });
      }
    } catch (err) {
      console.error('Error fetching internships:', err);
      res.status(500).json({
        success: false,
        message: 'Error occurred while fetching internships',
      });
    }
  }
  

// API to fetch RapidInternships from the database with pagination
async function fetchRapidInternshipPagination(req, res) {
  try {
    // Get page and limit from query parameters (default to page 1 and limit 24)
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 24;

    // Calculate the number of records to skip (offset)
    const skip = (page - 1) * limit;

    // Fetch the paginated data from the RapidInternship collection
    const internships = await RapidInternship.find()
      .skip(skip)     // Skip the records based on pagination
      .limit(limit);  // Limit the number of records fetched

    // Get the total number of internships for pagination info
    const totalInternships = await RapidInternship.countDocuments();

    // Calculate total pages
    const totalPages = Math.ceil(totalInternships / limit);

    // If internships are found, return them along with pagination info
    if (internships.length > 0) {
      res.json({
        success: true,
        message: 'Internships fetched successfully',
        data: internships,  
        pagination: {
          page: page,           // Current page
          limit: limit,         // Records per page
          totalInternships: totalInternships, // Total number of internships
          totalPages: totalPages // Total number of pages
        },
      });
    } else {
      res.json({
        success: true,
        message: 'No internships found in the database',
        data: [],  
        pagination: {
          page: page,
          limit: limit,
          totalInternships: 0,
          totalPages: 0
        },
      });
    }
  } catch (err) {
    console.error('Error fetching internships:', err);
    res.status(500).json({
      success: false,
      message: 'Error occurred while fetching internships',
    });
  }
}

 module.exports = { getRapidInternships, replaceLast100RapidInternships ,getAllRapidInternships, fetchRapidInternshipPagination};

