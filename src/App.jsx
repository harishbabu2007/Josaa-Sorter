import { useState, useEffect } from "react";
import Card from "./Components/Card";
import uuid4 from "uuid4";
import { utils, writeFile } from "xlsx";
import "./Styles/App.css";

let style_open = {
  display: "block",
};

let style_close = {
  display: "none",
};

function App() {
  const [popupStyle, setPopup] = useState(style_close);
  const [collegeData, setCollegeData] = useState([]);
  const [reload, setReload] = useState(true);

  function openPopup() {
    setPopup(style_open);
  }

  function closePopup() {
    setPopup(style_close);
  }

  function onAddSumbit(formData) {
    const college_name = formData.get("college_name");
    const course_name = formData.get("course_name");

    if (college_name.trim() !== "" && course_name !== "") {
      const _data = JSON.parse(localStorage.getItem("college_data"));

      const new_entry = {
        _college: college_name,
        _course: course_name,
        _uuid: uuid4(),
      };

      if (_data !== null) {
        localStorage.setItem(
          "college_data",
          JSON.stringify([..._data, new_entry])
        );
      } else {
        localStorage.setItem("college_data", JSON.stringify([new_entry]));
      }

      setReload(!reload);
      closePopup();
    } else {
      alert("please fill the form");
    }
  }

  function retriveData() {
    const _data = JSON.parse(localStorage.getItem("college_data"));
    if (_data !== null) {
      setCollegeData(_data);
    } else {
      localStorage.setItem("college_data", JSON.stringify(collegeData));
    }
  }

  function handleRemove(card_id) {
    const newList = collegeData.filter((item) => item._uuid !== card_id);
    setCollegeData(newList);
    localStorage.setItem("college_data", JSON.stringify(newList));
    setReload(!reload);
    alert("item removed");
  }

  const reorderArray = (event, originalArray) => {
    const movedItem = originalArray.find(
      (item, index) => index === event.oldIndex
    );
    const remainingItems = originalArray.filter(
      (item, index) => index !== event.oldIndex
    );

    const reorderedItems = [
      ...remainingItems.slice(0, event.newIndex),
      movedItem,
      ...remainingItems.slice(event.newIndex),
    ];

    return reorderedItems;
  };

  function reorderHandler(card_id, direction) {
    const _data_index = collegeData.findIndex((item) => item._uuid == card_id);

    let newList = reorderArray(
      {
        oldIndex: _data_index,
        newIndex: _data_index + (direction === "UP" ? -1 : 1),
      },
      collegeData
    );

    localStorage.setItem("college_data", JSON.stringify(newList));
    console.log(newList);
    setReload(!reload);
  }

  function exportJsonToExcel() {
    if (collegeData.length != 0) {
      let data_cov = [];

      collegeData.forEach((item, index) => {
        data_cov.push({
          Priority: index + 1,
          College: item._college,
          course: item._course,
        });
      });

      // Create a new workbook
      const workbook = utils.book_new();

      // Convert JSON data to a worksheet
      const worksheet = utils.json_to_sheet(data_cov);

      // Append the worksheet to the workbook
      utils.book_append_sheet(workbook, worksheet, "Sheet1");

      // Export the workbook as an Excel file
      writeFile(workbook, "priority_order.xlsx");
    } else {
      alert("no data to export");
    }
  }

  useEffect(() => {
    retriveData();
  }, [reload]);

  return (
    <>
      <div className="popup-overlay" id="popupOverlay" style={popupStyle}>
        <div className="popup" id="popup">
          <div className="popup-content">
            <div className="login-box">
              <span
                className="close"
                id="closePopup"
                onClick={() => closePopup()}
              >
                &times;
              </span>
              <h2>Add New Item</h2>
              <form action={onAddSumbit}>
                <div className="user-box">
                  <input autoComplete="off" type="text" name="college_name" />
                  <label>College Name</label>
                </div>
                <div className="user-box">
                  <input autoComplete="off" type="text" name="course_name" />
                  <label>Course</label>
                </div>
                <button type="submit">Add</button>
              </form>
            </div>
          </div>
        </div>
      </div>

      <div className="navbar">
        <h2 className="header">JOSAA sorter </h2>
        <div>
          <button
            onClick={() => {
              openPopup();
            }}
          >
            Add Item +
          </button>
          <button
            onClick={() => {
              exportJsonToExcel();
            }}
          >
            Export To Excel
          </button>
        </div>
      </div>
      <div className="mainContent">
        {/* <Card />
        <Card /> */}
        {collegeData.map((item) => {
          return (
            <Card
              key={item._uuid}
              collegename={item._college}
              course={item._course}
              handler={handleRemove}
              uuid={item._uuid}
              reorderHandler={reorderHandler}
            />
          );
        })}
      </div>
    </>
  );
}

export default App;
