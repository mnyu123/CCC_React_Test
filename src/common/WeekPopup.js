import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "react-modal"; //모달을 위해 react modal 컴포넌트를 사용했습니다.
import "../css/WeekPopup.css";
import axios from "axios";

const customStyles = {
  overlay: {
    zIndex: 10,
  },
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    backgroundColor: "white",
    position: "fixed",
    width: "400px",
  },
};

Modal.setAppElement("#root");

const WeekPopup = ({ onClose }) => {
  const [isRemembered, setIsRemembered] = useState(false);
  const [book, setBook] = useState(null); // 책 정보를 저장할 상태
  const navigate = useNavigate();
  const disableBodyScroll = () => {
    document.body.style.overflow = "hidden";
  };
  const enableBodyScroll = () => {
    document.body.style.overflow = "auto";
  };

  useEffect(() => {
    // 페이지가 로드될 때 로그인 상태를 확인
    const isLoggedIn = sessionStorage.getItem("isLoggedIn");

    // 로그인 상태가 true가 아닐 경우 로그인 페이지로 이동
    if (isLoggedIn !== "true") {
      navigate("/");
    } else {
      disableBodyScroll(); // 모달이 열릴 때 실행
      axios
        .get(`/api/aladin/1`, {
          params: {
            Query: "소설", // 검색어를 파라미터로 추가합니다.
            QueryType: "Title", // 검색어 종류를 'Title'로 설정합니다.
          },
        })
        .then((response) => {
          setBook(response.data.item[0]); // 첫 번째 결과를 가져옵니다.
        })
        .catch((error) => {
          console.log(error);
        });
    }
    // 사용자가 '오늘 다시 보지 않음'을 선택했는지 확인
    const dontShowToday = localStorage.getItem("dontShowToday");
    if (dontShowToday === "true") {
      onclose();
    }
  }, []);

  const handleCheckboxChange = (e) => {
    setIsRemembered(e.target.checked);
    if (e.target.checked) {
      localStorage.setItem("dontShowToday", "true"); // 체크박스를 체크하면 '오늘 다시 보지 않음'을 저장
      handleClose(); // 체크박스를 체크하면 팝업창을 닫습니다.
    }
  };

  const handleClose = () => {
    enableBodyScroll(); // 모달이 닫힐 때 실행
    onClose();
  };

  return (
    <Modal
      isOpen={sessionStorage.getItem("isLoggedIn") === "true"}
      onRequestClose={() => {
        enableBodyScroll(); // 모달이 닫힐 때 실행
        onClose();
      }} //모달이 닫힘(화면 외부를 클릭하거나 esc키 감지)
      style={customStyles}
      contentLabel="modal"
    >
      <div className="week">
        <div className="week-book">
          <h4>이번주의 책</h4>
        </div>
        <span className="close" onClick={handleClose}>
          &times;
        </span>
      </div>
      <hr />
      <div className="book">
        {book && (
          <>
            <div className="book-cover_w">
              <img src={book.cover} alt={book.title} />
            </div>
            <div className="book-explain">
              <div className="book-title_w">{book.title}</div>
              <div className="book-author_w">{book.author}</div>
              <div className="book-review_w">{book.description}</div>
            </div>
          </>
        )}
      </div>
      <hr />
      <div className="check-close">
        <input
          type="checkbox"
          id="remember"
          checked={isRemembered}
          onChange={handleCheckboxChange}
        />
        <label htmlFor="remember">오늘 하루 열지 않음</label>
      </div>
    </Modal>
  );
};

export default WeekPopup;
