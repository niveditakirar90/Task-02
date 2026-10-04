/* =====================================================
   WAITLY - CUSTOMER PORTAL
   script02.js
   ===================================================== */


/* =====================================================
   1. GET HTML ELEMENTS
   ===================================================== */

const queueForm = document.getElementById("queueForm");

const customerName = document.getElementById("customerName");
const customerMobile = document.getElementById("customerMobile");
const customerEmail = document.getElementById("customerEmail");
const serviceSelect = document.getElementById("serviceSelect");
const agreeTerms = document.getElementById("agreeTerms");

const tokenEmpty = document.getElementById("tokenEmpty");
const tokenCard = document.getElementById("tokenCard");

const portalModal = document.getElementById("portalModal");
const portalTitle = document.getElementById("portalTitle");

const toast = document.getElementById("toast");
const toastMessage = document.getElementById("toastMessage");
const toastIcon = document.getElementById("toastIcon");


/* =====================================================
   2. CUSTOMER SESSION
   ===================================================== */

let customerSession = null;


/* Load saved customer data */

function loadCustomerData() {

    const savedData =
        localStorage.getItem("waitlyCustomer");

    if (savedData) {

        try {

            customerSession =
                JSON.parse(savedData);

        } catch (error) {

            console.error(
                "Customer data error:",
                error
            );

            customerSession = null;

        }

    }

}


/* =====================================================
   3. SAVE CUSTOMER DATA
   ===================================================== */

function saveCustomerData() {

    if (!customerSession) {
        return;
    }

    localStorage.setItem(
        "waitlyCustomer",
        JSON.stringify(customerSession)
    );

}


/* =====================================================
   4. SCROLL FUNCTIONS
   ===================================================== */

function scrollToJoin() {

    const section =
        document.getElementById("join-queue");

    if (section) {

        section.scrollIntoView({
            behavior: "smooth"
        });

    }

}


function scrollToTrack() {

    const section =
        document.getElementById("track");

    if (section) {

        section.scrollIntoView({
            behavior: "smooth"
        });

    }

}


/* =====================================================
   5. GENERATE TOKEN
   ===================================================== */

function generateToken() {

    let lastToken =
        Number(
            localStorage.getItem("waitlyLastToken")
        ) || 40;


    lastToken++;


    localStorage.setItem(
        "waitlyLastToken",
        lastToken
    );


    return (
        "A-" +
        String(lastToken).padStart(3, "0")
    );

}


/* =====================================================
   6. CLEAR FORM ERRORS
   ===================================================== */

function clearErrors() {

    const errors =
        document.querySelectorAll(".input-error");


    errors.forEach(function(error) {

        error.textContent = "";

    });

}


/* =====================================================
   7. SHOW FORM ERROR
   ===================================================== */

function showError(
    elementId,
    message
) {

    const errorElement =
        document.getElementById(elementId);


    if (errorElement) {

        errorElement.textContent =
            message;

    }

}


/* =====================================================
   8. VALIDATE CUSTOMER FORM
   ===================================================== */

function validateForm() {

    clearErrors();


    const name =
        customerName.value.trim();

    const mobile =
        customerMobile.value.trim();

    const email =
        customerEmail.value.trim();

    const service =
        serviceSelect.value;


    let isValid = true;


    /* ---------- NAME ---------- */

    if (name.length < 2) {

        showError(
            "nameError",
            "Please enter your full name."
        );

        isValid = false;

    }


    /* ---------- MOBILE ---------- */

    if (!/^[6-9][0-9]{9}$/.test(mobile)) {

        showError(
            "mobileError",
            "Enter a valid 10-digit mobile number."
        );

        isValid = false;

    }


    /* ---------- EMAIL ---------- */

    if (
        email !== "" &&
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    ) {

        showError(
            "emailError",
            "Enter a valid email address."
        );

        isValid = false;

    }


    /* ---------- SERVICE ---------- */

    if (service === "") {

        showError(
            "serviceError",
            "Please select a service."
        );

        isValid = false;

    }


    /* ---------- CHECKBOX ---------- */

    if (!agreeTerms.checked) {

        showToast(
            "Please confirm your information.",
            "error"
        );

        isValid = false;

    }


    return isValid;

}


/* =====================================================
   9. JOIN QUEUE
   ===================================================== */

function joinQueue() {

    const isValid =
        validateForm();


    if (!isValid) {

        showToast(
            "Please correct the highlighted fields.",
            "error"
        );

        return;

    }


    /* Get values */

    const name =
        customerName.value.trim();

    const mobile =
        customerMobile.value.trim();

    const email =
        customerEmail.value.trim();

    const service =
        serviceSelect.value;


    /* Selected service */

    const selectedOption =
        serviceSelect.options[
            serviceSelect.selectedIndex
        ];


    const serviceTime =
        Number(
            selectedOption.dataset.time
        ) || 10;


    /* Generate token */

    const token =
        generateToken();


    /*
     * Demo queue information.
     * Backend will provide real values later.
     */

    const peopleAhead =
        Math.floor(
            Math.random() * 5
        ) + 1;


    const estimatedWait =
        peopleAhead * serviceTime;


    const counterNumber =
        Math.floor(
            Math.random() * 3
        ) + 1;


    /* Customer object */

    customerSession = {

        customerId:
            "CUS-" +
            Date.now(),

        name:
            name,

        mobile:
            mobile,

        email:
            email,

        service:
            service,

        token:
            token,

        peopleAhead:
            peopleAhead,

        estimatedWait:
            estimatedWait,

        currentServing:
            "A-038",

        counter:
            "Counter " +
            counterNumber,

        status:
            "WAITING",

        createdAt:
            new Date().toISOString()

    };


    /* Save data */

    saveCustomerData();


    /* Reset form */

    queueForm.reset();


    /* Display token */

    displayCustomerToken();


    /* Move to token section */

    setTimeout(function() {

        scrollToTrack();

    }, 200);


    /* Success message */

    showToast(
        "Your token " +
        token +
        " has been generated successfully.",
        "success"
    );

}


/* =====================================================
   10. FORM SUBMIT
   ===================================================== */

if (queueForm) {

    queueForm.addEventListener(
        "submit",
        function(event) {

            event.preventDefault();

            joinQueue();

        }
    );

}


/* =====================================================
   11. DISPLAY CUSTOMER TOKEN
   ===================================================== */

function displayCustomerToken() {

    if (!customerSession) {

        if (tokenEmpty) {
            tokenEmpty.style.display = "block";
        }

        if (tokenCard) {
            tokenCard.style.display = "none";
        }

        return;

    }


    /* Hide empty state */

    if (tokenEmpty) {
        tokenEmpty.style.display = "none";
    }


    /* Show token */

    if (tokenCard) {
        tokenCard.style.display = "block";
    }


    /* Token */

    const displayToken =
        document.getElementById(
            "displayToken"
        );

    if (displayToken) {

        displayToken.textContent =
            customerSession.token;

    }


    /* Name */

    const displayName =
        document.getElementById(
            "displayName"
        );

    if (displayName) {

        displayName.textContent =
            customerSession.name;

    }


    /* Service */

    const displayService =
        document.getElementById(
            "displayService"
        );

    if (displayService) {

        displayService.textContent =
            customerSession.service;

    }


    /* Current serving */

    const displayCurrent =
        document.getElementById(
            "displayCurrent"
        );

    if (displayCurrent) {

        displayCurrent.textContent =
            customerSession.currentServing;

    }


    /* People ahead */

    const displayAhead =
        document.getElementById(
            "displayAhead"
        );

    if (displayAhead) {

        displayAhead.textContent =
            customerSession.peopleAhead;

    }


    /* Estimated wait */

    const displayWait =
        document.getElementById(
            "displayWait"
        );

    if (displayWait) {

        displayWait.textContent =
            customerSession.estimatedWait +
            " min";

    }


    /* Counter */

    const displayCounter =
        document.getElementById(
            "displayCounter"
        );

    if (displayCounter) {

        displayCounter.textContent =
            customerSession.counter;

    }


    /* Status */

    const tokenStatus =
        document.getElementById(
            "tokenStatus"
        );

    if (tokenStatus) {

        tokenStatus.textContent =
            customerSession.status;

    }


    updateProgress();

}


/* =====================================================
   12. QUEUE PROGRESS
   ===================================================== */

function updateProgress() {

    if (!customerSession) {
        return;
    }


    const ahead =
        customerSession.peopleAhead;


    let progress = 20;


    if (ahead <= 0) {

        progress = 100;

    }

    else if (ahead === 1) {

        progress = 80;

    }

    else if (ahead === 2) {

        progress = 60;

    }

    else if (ahead === 3) {

        progress = 40;

    }

    else {

        progress = 20;

    }


    const progressFill =
        document.getElementById(
            "progressFill"
        );


    if (progressFill) {

        progressFill.style.width =
            progress + "%";

    }


    const progressText =
        document.getElementById(
            "progressText"
        );


    if (progressText) {

        progressText.textContent =
            customerSession.status;

    }


    updateNotification();

}


/* =====================================================
   13. CUSTOMER NOTIFICATION
   ===================================================== */

function updateNotification() {

    if (!customerSession) {
        return;
    }


    const notificationText =
        document.getElementById(
            "notificationText"
        );


    if (!notificationText) {
        return;
    }


    if (
        customerSession.status ===
        "COMPLETED"
    ) {

        notificationText.textContent =
            "Your service has been completed.";

        return;

    }


    if (
        customerSession.peopleAhead <= 0
    ) {

        notificationText.textContent =
            "Your turn is now. Please proceed to " +
            customerSession.counter +
            ".";

        return;

    }


    if (
        customerSession.peopleAhead <= 2
    ) {

        notificationText.textContent =
            "Your turn is approaching. Please stay nearby.";

        return;

    }


    notificationText.textContent =
        "You have successfully joined the queue.";

}


/* =====================================================
   14. SIMULATE QUEUE MOVEMENT
   ===================================================== */

/*
   This is ONLY a frontend demo.

   Later:

   Staff clicks "Call Next"
          ↓
   Backend updates database
          ↓
   Customer queue position changes
          ↓
   Customer receives real-time update
          ↓
   SMS notification is sent
*/

function simulateQueueMovement() {

    if (!customerSession) {
        return;
    }


    if (
        customerSession.status !==
        "WAITING"
    ) {

        return;

    }


    if (
        customerSession.peopleAhead > 0
    ) {

        customerSession.peopleAhead--;


        customerSession.estimatedWait =
            Math.max(
                0,
                customerSession.estimatedWait - 10
            );


        /* Your turn */

        if (
            customerSession.peopleAhead === 0
        ) {

            customerSession.status =
                "YOUR TURN";


            customerSession.estimatedWait =
                0;


            showToast(
                "Your turn is now!",
                "success"
            );

        }


        /* Approaching */

        else if (
            customerSession.peopleAhead <= 2
        ) {

            showToast(
                "Your turn is approaching.",
                "info"
            );

        }


        saveCustomerData();

        displayCustomerToken();

    }

}


/* =====================================================
   15. LEAVE QUEUE
   ===================================================== */

function leaveQueue() {

    if (!customerSession) {
        return;
    }


    const confirmation =
        confirm(
            "Are you sure you want to leave the queue?"
        );


    if (!confirmation) {
        return;
    }


    /* Remove customer session */

    localStorage.removeItem(
        "waitlyCustomer"
    );


    customerSession = null;


    /* Update UI */

    displayCustomerToken();


    showToast(
        "You have left the queue.",
        "success"
    );


    /* Scroll back */

    setTimeout(function() {

        scrollToJoin();

    }, 200);

}


/* =====================================================
   16. STAFF / ADMIN PORTAL MODAL
   ===================================================== */

function openPortal(role) {

    if (!portalModal || !portalTitle) {
        return;
    }


    if (role === "staff") {

        portalTitle.textContent =
            "Staff Portal";

    }

    else if (role === "admin") {

        portalTitle.textContent =
            "Admin Portal";

    }


    portalModal.classList.add(
        "active"
    );

}


function closePortal() {

    if (!portalModal) {
        return;
    }


    portalModal.classList.remove(
        "active"
    );

}


/* =====================================================
   17. CLOSE MODAL ON BACKGROUND CLICK
   ===================================================== */

if (portalModal) {

    portalModal.addEventListener(
        "click",
        function(event) {

            if (
                event.target ===
                portalModal
            ) {

                closePortal();

            }

        }
    );

}


/* =====================================================
   18. ESC KEY CLOSE MODAL
   ===================================================== */

document.addEventListener(
    "keydown",
    function(event) {

        if (
            event.key === "Escape"
        ) {

            closePortal();

        }

    }
);


/* =====================================================
   19. TOAST MESSAGE
   ===================================================== */

function showToast(
    message,
    type = "success"
) {

    if (
        !toast ||
        !toastMessage ||
        !toastIcon
    ) {

        return;

    }


    toastMessage.textContent =
        message;


    /* Success */

    if (type === "success") {

        toastIcon.textContent =
            "✓";

    }


    /* Error */

    else if (type === "error") {

        toastIcon.textContent =
            "×";

    }


    /* Information */

    else {

        toastIcon.textContent =
            "i";

    }


    toast.classList.add(
        "show"
    );


    setTimeout(
        function() {

            toast.classList.remove(
                "show"
            );

        },
        3000
    );

}


/* =====================================================
   20. MOBILE NUMBER INPUT
   ===================================================== */

if (customerMobile) {

    customerMobile.addEventListener(
        "input",
        function() {

            this.value =
                this.value.replace(
                    /[^0-9]/g,
                    ""
                );

        }
    );

}


/* =====================================================
   21. REAL-TIME ERROR CLEARING
   ===================================================== */

if (customerName) {

    customerName.addEventListener(
        "input",
        function() {

            showError(
                "nameError",
                ""
            );

        }
    );

}


if (customerMobile) {

    customerMobile.addEventListener(
        "input",
        function() {

            showError(
                "mobileError",
                ""
            );

        }
    );

}


if (customerEmail) {

    customerEmail.addEventListener(
        "input",
        function() {

            showError(
                "emailError",
                ""
            );

        }
    );

}


if (serviceSelect) {

    serviceSelect.addEventListener(
        "change",
        function() {

            showError(
                "serviceError",
                ""
            );

        }
    );

}


/* =====================================================
   22. PAGE LOAD
   ===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    function() {

        loadCustomerData();

        displayCustomerToken();

    }
);


/* =====================================================
   23. DEMO QUEUE TIMER
   ===================================================== */

/*
   Every 30 seconds:
   1 person moves from the queue.

   This will be removed when
   backend + Staff Portal is connected.
*/

setInterval(
    function() {

        simulateQueueMovement();

    },
    30000
);

/* =====================================================
   ADMIN LOGIN
   ===================================================== */


/* Admin credentials - DEMO ONLY */

const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "waitly@123";


/* Get elements */

const adminLoginModal =
    document.getElementById(
        "adminLoginModal"
    );


const adminLoginForm =
    document.getElementById(
        "adminLoginForm"
    );


const adminUsername =
    document.getElementById(
        "adminUsername"
    );


const adminPassword =
    document.getElementById(
        "adminPassword"
    );


const adminLoginError =
    document.getElementById(
        "adminLoginError"
    );


/* ================= OPEN LOGIN ================= */

function openAdminLogin() {

    if (!adminLoginModal) {
        return;
    }


    adminLoginModal.classList.add(
        "active"
    );


    setTimeout(function() {

        if (adminUsername) {

            adminUsername.focus();

        }

    }, 200);

}


/* ================= CLOSE LOGIN ================= */

function closeAdminLogin() {

    if (!adminLoginModal) {
        return;
    }


    adminLoginModal.classList.remove(
        "active"
    );


    if (adminLoginForm) {

        adminLoginForm.reset();

    }


    if (adminLoginError) {

        adminLoginError.textContent = "";

    }

}


/* ================= ADMIN LOGIN ================= */

if (adminLoginForm) {

    adminLoginForm.addEventListener(
        "submit",
        function(event) {

            event.preventDefault();


            const username =
                adminUsername.value.trim();


            const password =
                adminPassword.value;


            /* Clear old error */

            adminLoginError.textContent =
                "";


            /* Check login */

            if (
                username === ADMIN_USERNAME &&
                password === ADMIN_PASSWORD
            ) {

                /*
                 * Demo login session.
                 * Real project will use backend authentication.
                 */

                sessionStorage.setItem(
                    "waitlyAdminLoggedIn",
                    "true"
                );


                showToast(
                    "Admin login successful.",
                    "success"
                );


                setTimeout(function() {

                    window.location.href =
                        "admin02.html";

                }, 500);

            }

            else {

                adminLoginError.textContent =
                    "Invalid username or password.";

                showToast(
                    "Invalid admin credentials.",
                    "error"
                );

            }

        }
    );

}


/* ================= CLOSE ON BACKGROUND ================= */

if (adminLoginModal) {

    adminLoginModal.addEventListener(
        "click",
        function(event) {

            if (
                event.target ===
                adminLoginModal
            ) {

                closeAdminLogin();

            }

        }
    );

}


/* ================= ESC KEY ================= */

document.addEventListener(
    "keydown",
    function(event) {

        if (
            event.key === "Escape"
        ) {

            closeAdminLogin();

        }

    }
);
