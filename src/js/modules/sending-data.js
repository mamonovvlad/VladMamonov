const proxy = "/proxy.php?url=",
  name = 'api.7money.c';

const updateTable = (data) => {
  let url = proxy +
    encodeURIComponent(
      `https://${name}/v1/course/change-course?access-token=EFjko3OineBf8RQCth33wpC0dZqM4CyO&_format=json`
    ) +
    '&method=POST&data=' + encodeURIComponent(data);
  
  fetch(url, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json;charset=utf-8'
      },
      body: data
    }
  ).then(function (res) {
  })
  
}

const changeMultiple = (data) => {
  let courses = {};
  courses.json = data;
  courses = JSON.stringify(courses);
  let url = proxy +
    encodeURIComponent(
      `https://${name}/v1/course/change-multiple-course?access-token=EFjko3OineBf8RQCth33wpC0dZqM4CyO&_format=json`
    ) +
    '&method=POST&data=' + encodeURIComponent(courses);
  
  fetch(url, {
      
      method: "POST",
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
      body: courses,
    }
  ).then(function (res) {
  })
  
}

const changeCourseCity = (data) => {
  let url = proxy +
    encodeURIComponent(
      `https://${name}/v1/course-city/change?access-token=EFjko3OineBf8RQCth33wpC0dZqM4CyO&_format=json`
    ) +
    '&method=POST&data=' + encodeURIComponent(data);
  
  fetch(url, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json;charset=utf-8'
      },
      body: data
    }
  ).then(function (res) {
  })
  
}


export {updateTable, changeMultiple, changeCourseCity};