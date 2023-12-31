import utils from "./assets/utils.js";
import api from "./assets/auth.js";

let {$$, $} = utils;
let {signIn, signUp} = api;

/// ----------- BTN CHANGE ACTION --------------------

$$(".change-btn").forEach((button, index) => {
    button.addEventListener("click", () => {
        localStorage.setItem("tabNumber", index);

        console.log(localStorage.getItem("tabNumber"));

        showContent(index);
    });
});

// ---------------- TAB ACTIVATION ACTIONS ------------

function hideContent() {
    $$(".tab-item").forEach((tab) => {
        tab.style.display = "none";
    });
}

function showContent(index) {
    hideContent();
    $$(".tab-item")[index].style.display = "block";
}

hideContent();
showContent(localStorage.getItem("tabNumber") || 1);

// ----------------- modal actions --------------------

$("#openModal").addEventListener("click", () => {
    $(".modal-wrapper").classList.add("grid");
    $(".modal-wrapper").classList.remove("hidden");
});

$("#closeModal").addEventListener("click", () => {
    $(".modal-wrapper").classList.add("hidden");
    $(".modal-wrapper").classList.remove("grid");
});

$("#add_btn").addEventListener("click", () => {
	$(".modal-wrapper").classList.add("grid");
	$(".modal-wrapper").classList.remove("hidden");
});

// ----------------- modal actions end --------------------

// -------------------- authorization actions  --------------------

$("#signup").addEventListener("click", (e) => {
    e.preventDefault();

    const signUpForm = {
        full_name: $("#full_name").value,
        password: $("#password").value,
        username: $("#user_name").value,
    };

    if ($("#confirm_password").value.trim() === signUpForm.password.trim()) {
        $("#password").classList.add("border", "border-2", "border-green-500");
        $("#confirm_password").classList.add("border", "border-2", "border-green-500");

        signUp(signUpForm)
        .then((response) => response.json())
        .then((result) => {
            if (result.statusCode == "400") {
                alert(result.message);
            } else {
                alert("Success!");
            }
        })
        .catch((error) => {
            alert(error.message);
        });
    } else {
        $("#password").classList.add("border", "border-2", "border-red-500");
        $("#confirm_password").classList.add("border", "border-2", "border-red-500");
    }
});

$("#signin").addEventListener("click", (e) => {
    e.preventDefault();

    const signInForm = {
        password: $("#login_password").value,
        username: $("#login_user").value,
    };

    if (signInForm.password.trim().length === 0 || signInForm.username.trim().length === 0) {
        alert("Please enter your password or username");
        $("#login_password").classList.add("border", "border-2", "border-red-500");
        $("#login_user").classList.add("border", "border-2", "border-red-500");
    } else {
        signIn(signInForm)
        .then((response) => response.json())
        .then((result) => {
            localStorage.setItem("token", result.token);
            localStorage.setItem("user", result.user.id);
            localStorage.setItem("username", result?.user?.full_name);
            window.location.href = "./profile.html";

            if (result.statusCode == "400") {
                $("#login_password").classList.add("border", "border-2", "border-red-500");
                $("#login_user").classList.add("border", "border-2", "border-red-500");
            } else {
                $("#login_password").classList.add("border", "border-2", "border-green-500");
                $("#login_user").classList.add("border", "border-2", "border-green-500");
            }
        })
        .catch((error) => {
            alert(error.message);
        });
    }
});

// -------------------- authorization actions end  --------------------

function authChek() {
    if (localStorage.getItem("token")) {
        $(".menu").classList.remove("hidden");
        $("#openModal").classList.add("hidden");
        $("#user_info").textContent = localStorage.getItem("username");
        $('#auth').classList.add('hidden');
    } else {
        $('#auth').classList.remove('hidden');
        $(".menu").classList.add("hidden");
        $(".dropdown").classList.add("hidden");
        $("#openModal").classList.remove("hidden");
        $('#addpost').classList.add('hidden');
    }
}

authChek();

$(".menu").addEventListener("click", () => {
    $(".dropdown").classList.toggle("hidden");
});

$("#logout").addEventListener("click", () => {
    localStorage.clear();
    location.reload();
});



// -----------------    BLOG POST   ---------------------

function addPost(){
    const newBlog = {
        title: $("#blog_title").value,
        body: $("#blog_text").value,
        user_id: localStorage.getItem('user'),
    };



    if (newBlog.title.trim().length === 0 || newBlog.body.trim().length === 0){
        alert("Please fill post title and body");
    }
    else{
        fetch(`https://nest-blog-qdsa.onrender.com/api/blog`,{
            method: "POST",
            headers: {
                "Content-Type" : "application/json",
                Authorization: `Bearer $localStorage.getItem("token)}`,
            },
            body: JSON.stringify(newBlog),
        })
        .then((res)=> res.json())
        .then((res)=> console.log(res))
    }
}

$('#save').addEventListener('click',()=>{
    addPost()
});