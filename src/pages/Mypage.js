import React, { useState, useEffect } from "react";
import "../css/Mypage.css"; // Mypage.css를 불러옵니다.
import Polledit from "../common/Polledit"; // 수정된 부분
import { useNavigate } from "react-router-dom";

const Mypage = ({ isMypageOpen, onClose }) => {
  const [isPolleditOpen, setIsPolleditOpen] = useState(false);
  const [userid, setUserid] = useState(null); // userid를 상태로 관리
  const navigate = useNavigate();
  const userpw = JSON.parse(sessionStorage.getItem("userpw"));

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [usergenre, setGenre] = useState("");

  const [isCurrentPasswordValid, setIsCurrentPasswordValid] = useState(true);
const [isNewPasswordSameAsCurrent, setIsNewPasswordSameAsCurrent] = useState(false);
const [isNewPasswordDiff, setIsNewPasswordDiff] = useState(false);

  const [userName, setUserName] = useState(""); // UserName 상태 추가
  const [userGender, setUserGender] = useState(""); // UserGender 상태 추가
  

  const handleChangePassword = () => {
    if (currentPassword !== userpw) {
      console.log("현재 비밀번호가 일치하지 않습니다.");
      setIsCurrentPasswordValid(false);
      return;
    }

    setIsCurrentPasswordValid(true);

    if (newPassword === currentPassword) {
      setIsNewPasswordSameAsCurrent(true);
      return;
    }

    setIsNewPasswordSameAsCurrent(false);

    if (newPassword !== confirmPassword) {
      console.log("새 비밀번호와 비밀번호 확인이 일치하지 않습니다.");
      setIsNewPasswordDiff(true);
      return;
    }

    setIsNewPasswordDiff(false);

    fetch("/api/changePassword", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: userid, newPassword: newPassword }),
    })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        console.log(data.message);
        setCurrentPassword(""); 
        setNewPassword(""); 
        setConfirmPassword(""); 
        sessionStorage.setItem("userpw", JSON.stringify(newPassword));
        setTimeout(() => alert("비밀번호가 변경되었습니다."), 0); // 알림창 띄우기
      } else {
        console.log(data.error);
      }
    });


  };

  useEffect(() => {
    const storedUserid = sessionStorage.getItem("userid");
    console.log("누가 로그인 했나요?:",storedUserid); // 로그 추가
    if (storedUserid) {
      setUserid(JSON.parse(storedUserid));

      fetch(`/api/user/${storedUserid}`)
        .then((response) => response.json())
        .then((data) => {
          console.log("API 응답:", data); // 로그 추가
          if (data.success) {
            setUserName(data.UserName); // 상태를 이용해 값 설정
            setUserGender(data.UserGender); // 상태를 이용해 값 설정
          } else {
            console.log(data.error);
          }
        });
    }
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem("userid");
    sessionStorage.removeItem("userpw");
    sessionStorage.setItem("isLoggedIn", "false");
    setUserid(null); // 로그아웃하면 userid를 null로 설정
     window.location.reload();
    navigate("/");
    console.log('onClose:', onClose);
  };

  const openPolledit = () => {
    setIsPolleditOpen(true);
  };

  const closePolledit = () => {
    setIsPolleditOpen(false);
  };

  

  return (
    <div className={`modal ${isMypageOpen ? "open" : ""}`}>
      <div className="modal-content">
        <h2>마이페이지</h2>
        <div className="user_id">
          <span>
            <img src="/images/ccc_image/ghost.png" alt="profile" />
          </span>
          <span className="userid_wrap"> {userid}</span>
          <span>님,</span>
        </div>
        <div className="dotted-line_mp"></div>
        <div className="name_fwrap">
          이름 <input type="text" value={userName} readOnly /> 성별{" "}
          <input type="text" value={userGender} readOnly />
        </div>
        <div className="dotted-line_mp"></div>

        <div className="newpassword_wrap">
          비밀번호 변경
          <div className="input_row mg" id="pw_line">
            <input
              type="password"
              id="currentPasswordInput"
              placeholder="현재 비밀번호"
              title="비밀번호"
              className="input_text required-input"
              maxLength="16"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
          </div>
          {!isCurrentPasswordValid && <p style={{ color: 'red' }}>비밀번호가 일치하지 않습니다.</p>}
          <div className="input_row mg" id="pw_line">
            <input
              type="password"
              id="newpasswordInput"
              placeholder="새 비밀번호"
              title="비밀번호"
              className="input_text required-input"
              maxLength="16"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>
          {isNewPasswordSameAsCurrent && <p style={{ color: 'red' }}>현재 비밀번호와 동일합니다.</p>}
          <div className="input_row mg" id="pw_line">
            <input
              type="password"
              id="newpasswordcheck"
              placeholder="새 비밀번호 확인"
              title="비밀번호"
              className="input_text required-input"
              maxLength="16"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
          {isNewPasswordDiff && <p style={{ color: 'red' }}>새 비밀번호와 비밀번호 확인이 일치하지 않습니다.</p>}
          <button
            type="submit"
            className="btn_login"
            id="changePassword"
            onClick={handleChangePassword} disabled={!currentPassword || !newPassword || !confirmPassword}
            style={{ backgroundColor: (!currentPassword || !newPassword || !confirmPassword) ? 'gray' : '#692ead' }}
          >
            <span className="btn_text">변경</span>
          </button>
        </div>
        <div className="dotted-line_mp"></div>
        <div className="fq_wrap">
          선호장르{" "}
          <input
            type="text"
            id="genre"
            value={usergenre}
            onChange={(e) => setGenre(e.target.value)}
          />{" "}
          <button onClick={openPolledit}>장르 재선택</button>
        </div>
        <div className="dotted-line"></div>
        <button onClick={handleLogout}>로그아웃</button>

        <button onClick={onClose}>닫기</button>
        {isPolleditOpen && <Polledit onClose={closePolledit} />}
      </div>
    </div>
  );
};

export default Mypage;
