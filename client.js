$(function () {
    var pagesize = 20;
    var pageNo = 1;
    var pageMax = 2;
    getEvents(1);

    document.getElementById("nextPageBtn").addEventListener("click", function() {
      pageNo++;
      getEvents(pageNo);
    });

    document.getElementById("prevPageBtn").addEventListener("click", function() {
      pageNo--;
      getEvents(pageNo);
    });

    document.getElementById("firstPageBtn").addEventListener("click", function() {
      getEvents(1);
    });

    document.getElementById("lastPageBtn").addEventListener("click", function() {
      getEvents(pageMax);
    });
  
    function getEvents(page) {
      $.getJSON({
        url: "https://modasclient-tlg.azurewebsites.net/api/event/pagesize/" + pagesize + "/page/" + page,
        success: function (response, textStatus, jqXhr) {
          console.log(response);
          pageMax = response.pagingInfo.totalPages;
          updateTable();

          document.getElementById("pageNo").innerHTML = response.pagingInfo.rangeStart + "-" + response.pagingInfo.rangeEnd + " of " + response.pagingInfo.totalItems;

          function updateTable() {
            $("#tbody tr").remove(); 
            response.events.forEach(e => {
              var row = document.createElement("tr");
              var flagData = document.createElement("td");
              var dateData = document.createElement("td");
              var timeData = document.createElement("td");
              var locData = document.createElement("td");
              if (e.flag) {
                flagData.innerHTML = "<i class='far fa-check-square'></i>";
              }
              else {
                flagData.innerHTML = "<i class='far fa-square'></i>";
              }
              dateData.innerHTML = e.stamp.slice(0, 10);
              var time = e.stamp.slice(-8, -3);
              // time format
              var hr = time.slice(0,2);
              //console.log(hr);
              var min = time.slice(3,6);
              //console.log(min);
              var addend;
              if (hr > 12) {
                hr = hr - 12;
                addend = " PM";
              }
              else if (hr == 12) {
                addend = " PM";
              }
              else if (hr == 0) {
                hr = 12;
                addend = " AM";
              }
              else {
                hr = hr.slice(1, 2);
                addend = " AM";
              }
              time = hr + ":" + min + addend;

              timeData.innerHTML = time;
              locData.innerHTML = e.loc;

              row.appendChild(flagData);
              row.appendChild(dateData);
              row.appendChild(timeData);
              row.appendChild(locData);

              document.getElementById("tbody").appendChild(row);
            });
          }
        },
        error: function (jqXHR, textStatus, errorThrown) {
          // log the error to the console
          console.log("The following error occured: " + textStatus, errorThrown);
        }
      });
    }

});