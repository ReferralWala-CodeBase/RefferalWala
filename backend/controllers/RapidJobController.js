const axios = require('axios');
const RapidJob = require('../models/RapidJob');  // Ensure your model path is correct

async function fetchData(start) {
  const options = {
    method: 'GET',
    url: 'https://linkedin-api8.p.rapidapi.com/search-jobs-v2',
    params: {
      keywords: 'Software Developers',
      locationId: '102713980',
      datePosted: 'pastWeek',
      start: start.toString(),
      sort: 'mostRelevant',
    },
    headers: {
      'x-rapidapi-key': '6f8b59e1fcmsh453807decf6cf37p18580djsne726920872f3',
      'x-rapidapi-host': 'linkedin-api8.p.rapidapi.com',
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

async function getRapidJobs(req, res) {
  let start = 0; 
  const limit = 4; 
  let allRapidJobs = []; 

  try {
    // Fetch multiple pages by incrementing the 'start' value
    for (let i = 0; i < limit; i++) {
  
      const rapidJobs = await fetchData(start); 

      if (rapidJobs && rapidJobs.length > 0) {
        allRapidJobs = allRapidJobs.concat(rapidJobs); // Append jobs to the list
      }

      start += 50; // Increase the start value for pagination
    }

    // If there are jobs to insert, do so into MongoDB
    if (allRapidJobs.length > 0) {
      await RapidJob.insertMany(
        allRapidJobs.map(job => ({
          jobId: job.id,
          title: job.title,
          url: job.url,
          referenceId: job.referenceId,
          posterId: job.posterId,
          company: {
            name: job.company?.name || 'N/A', 
            logo: job.company?.logo || 'N/A',
            url: job.company?.url || 'N/A', 
            
          },
          location: job.location || 'N/A', 
          type: job.type || 'N/A',
          postDate: job.postAt || 'N/A', 
          benefits: job.benefits || 'N/A', 
        }))
      );

    }

    res.json({
      success: true,
      message: 'Jobs successfully fetched and stored',
      data: allRapidJobs,
    });
  } catch (err) {
    console.error('Error during rapid job aggregation or insertion:', err);
    res.status(500).json({
      success: false,
      message: 'Error occurred while fetching or saving rapid jobs',
    });
  }
}




async function replaceLast100RapidJobs(req, res) {
    try {
      // Delete the last 100 records from the RapidJob collection
      const deletedJobs = await RapidJob.find().sort({ _id: -1 }).limit(100); 
      if (deletedJobs.length > 0) {
        await RapidJob.deleteMany({ _id: { $in: deletedJobs.map(job => job._id) } }); 
     
      }
  
      // Fetch new job data
      let start = 0; // Initial start value
      const limit = 2; // Number of times to paginate (you can adjust this value as needed)
      let newRapidJobs = [];
  
      for (let i = 0; i < limit; i++) {
    // Log the start value
        const rapidJobs = await fetchData(start); // Fetch data for the current 'start' value
        if (rapidJobs && rapidJobs.length > 0) {
          newRapidJobs = newRapidJobs.concat(rapidJobs); // Append new jobs to the list
        }
        start += 50; // Increase the start value for pagination
      }
  
      // If new jobs are fetched, insert them into MongoDB
      if (newRapidJobs.length > 0) {
        await RapidJob.insertMany(
          newRapidJobs.map(job => ({
            jobId: job.id,
            title: job.title,
            url: job.url,
            referenceId: job.referenceId,
            posterId: job.posterId,
            company: {
              name: job.company?.name || 'N/A',
              logo: job.company?.logo || 'N/A',
              url: job.company?.url || 'N/A'
            },
            location: job.location || 'N/A',
            type: job.type || 'N/A',
            postDate: job.postDate || 'N/A',
            benefits: job.benefits || 'N/A',
          }))
        );
       
      }
  
      // Return success message
      res.json({
        success: true,
        message: 'Last 100 jobs replaced successfully',
        data: newRapidJobs,
      });
    } catch (err) {
      console.error('Error during replacing last 100 jobs:', err);
      res.status(500).json({
        success: false,
        message: 'Error occurred while replacing the last 100 jobs',
      });
    }
  }


  // API to fetch all jobs from the database
async function getAllRapidJobs(req, res) {
    try {
      // Fetch all jobs from the RapidJob collection
      const jobs = await RapidJob.find();  
  
      // If jobs are found, return them
      if (jobs.length > 0) {
        res.json({
          success: true,
          message: 'All jobs fetched successfully',
          data: jobs, 
        });
      } else {
        res.json({
          success: true,
          message: 'No jobs found in the database',
          data: [],  // Return an empty array if no jobs are found
        });
      }
    } catch (err) {
      console.error('Error fetching jobs:', err);
      res.status(500).json({
        success: false,
        message: 'Error occurred while fetching jobs',
      });
    }
  }
  

// API to fetch RapidJobs from the database with pagination
async function fetchRapidJobPagination(req, res) {
  try {
    // Get page and limit from query parameters (default to page 1 and limit 24)
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 24;

    // Calculate the number of records to skip (offset)
    const skip = (page - 1) * limit;

    // Fetch the paginated data from the RapidJob collection
    const jobs = await RapidJob.find()
      .skip(skip)     // Skip the records based on pagination
      .limit(limit);  // Limit the number of records fetched

    // Get the total number of jobs for pagination info
    const totalJobs = await RapidJob.countDocuments();

    // Calculate total pages
    const totalPages = Math.ceil(totalJobs / limit);

    // If jobs are found, return them along with pagination info
    if (jobs.length > 0) {
      res.json({
        success: true,
        message: 'Jobs fetched successfully',
        data: jobs,  
        pagination: {
          page: page,           // Current page
          limit: limit,         // Records per page
          totalJobs: totalJobs, // Total number of jobs
          totalPages: totalPages // Total number of pages
        },
      });
    } else {
      res.json({
        success: true,
        message: 'No jobs found in the database',
        data: [],  
        pagination: {
          page: page,
          limit: limit,
          totalJobs: 0,
          totalPages: 0
        },
      });
    }
  } catch (err) {
    console.error('Error fetching jobs:', err);
    res.status(500).json({
      success: false,
      message: 'Error occurred while fetching jobs',
    });
  }
}

 module.exports = { getRapidJobs, replaceLast100RapidJobs ,getAllRapidJobs, fetchRapidJobPagination};

