let theWheel;
let raffleSettings = {
  general: {
    title: "",
    raffleSize: "450",
    fontSize: "16",
    eliminateWinner: false,
    rememberSettings: false,
  },
  data: {
    source: "manual",
    items: [],
  },
  hasEnded: false,
  hasCreatedRaffle: false,
};
let tempRaffleData = [];
let spinData = [];
let customSwal;
const createWheel = (wheelData) => {
  spinData = wheelData.slice();
  const data = formatRaffleData(spinData);
  theWheel = new Winwheel({
    canvasId: "raffleCanvas",
    numSegments: data.length,
    responsive: true,
    segments: data,
    lineWidth: 2,
    textFontFamily: "sans-serif",
    textFontSize: raffleSettings.general.fontSize,
    textAlignment: "outer",
    innerRadius: 40,
    // Note animation properties passed in constructor parameters.
    animation: {
      type: "spinToStop", // Type of animation.
      duration: 5, // How long the animation is to take in seconds.
      spins: 10, // The number of complete 360 degree rotations the wheel is to do.
      easing: "Power4.easeInOut",
      // Remember to do something after the animation has finished specify callback function.
      callbackFinished: "onSpinStopped()",

      // During the animation need to call the drawTriangle() to re-draw the pointer each frame.
    },
    pointerAngle: 0,
    // Turn pointer guide on.
    pointerGuide: {
      display: false,
      strokeStyle: "red",
      lineWidth: 2,
      textMargin: 0,
    },
  });
  raffleSettings.hasCreatedRaffle = true;
};
const addRaffleDataItems = (items, dataPosition = null) => {
  if (items.length <= 0) {
    $("#clearEntriesBtn").addClass("hidden");
    return;
  }
  $("#clearEntriesBtn").removeClass("hidden");
  items.forEach((item, index) => {
    $("#raffleDataItems").prepend(
      `<h5 data-position="${
        dataPosition !== null ? dataPosition : index
      }" class="bg-white me-1">
        <span class="badge text-primary shadow-sm">
          <span class="me-1">${item}</span>
          <i onclick="removeRaffleDataItem($(this))"
            class="fas fa-times-circle text-muted align-middle hover-cursor-pointer"
          ></i>
        </span>
      </h5>`
    );
  });
};
const updateRaffleArea = () => {
  $("#raffleTitle").text(raffleSettings.general.title);
};
const updateWheel = (data) => {
  createWheel(data);
};
const formatRaffleData = (data) => {
  return data.map((item, index) => ({
    text: item.length > 22 ? `${item.slice(0, 22)}...` : item,
    fillStyle: index % 2 === 0 ? "#007bff" : "#343a40",
    textFillStyle: "#fff",
  }));
};
$("#importedRaffleDataSourceInput").on("change", function (e) {
  const upload = document.querySelector("#importedRaffleDataSourceInput");
  if (upload.files.length <= 0) {
    return;
  }
  $("#importsRaffleDataSource .spinner").removeClass("hidden");
  const uploadedFile = upload.files[0];
  const fileReader = new FileReader();
  let file;
  fileReader.onload = (e) => {
    file = e.target.result;
    tempRaffleData = file.split(/,|,s|\s|\r/);
    tempRaffleData = tempRaffleData.filter((item) => item !== "");
    $("#raffleDataItems").empty();
    addRaffleDataItems(tempRaffleData);
    $("#importsRaffleDataSource .spinner").addClass("hidden");
  };
  fileReader.onerror = (error) => {
    $("#importsRaffleDataSource .spinner").addClass("hidden");
    customSwal.error("", "Your file is badly formmatted");
    console.log(
      "Raffle Data File Upload Error" + ":" + error.target.error.name
    );
  };
  fileReader.readAsText(uploadedFile);
});
$("#settingsModal").on("show.bs.modal", function () {
  // general tab
  $("#raffleTitleInput").val(raffleSettings.general.title);
  $("#raffleSize").val(raffleSettings.general.raffleSize);
  $("#raffleFontSize").val(raffleSettings.general.fontSize);
  $("#eliminateWinnerSwitch").prop(
    "checked",
    raffleSettings.general.eliminateWinner
  );
  $("#rememberSettingsSwitch").prop(
    "checked",
    raffleSettings.general.rememberSettings
  );
  // data tab
  $("#raffleDataSource").val(raffleSettings.data.source).trigger("change");
  tempRaffleData = raffleSettings.data.items.slice();
  addRaffleDataItems(tempRaffleData);
});
$("#settingsModal").on("hidden.bs.modal", function () {
  $("#importedRaffleDataSourceInput").val("");
});
$("#raffleDataSource").on("change", function () {
  $("#raffleDataItems").empty();
  tempRaffleData = [];
  switch ($(this).val()) {
    case "imports":
      $("#importsRaffleDataSource").addClass("show").removeClass("hidden");
      $("#manualRaffleDataSource, #apiRaffleDataSource")
        .addClass("hidden")
        .removeClass("show");
      break;
    case "api":
      $("#apiRaffleDataSource").addClass("show").removeClass("hidden");
      $("#importsRaffleDataSource, #manualRaffleDataSource")
        .addClass("hidden")
        .removeClass("show");
      break;
    default:
      $("#manualRaffleDataSource").addClass("show").removeClass("hidden");
      $("#importsRaffleDataSource, #apiRaffleDataSource")
        .addClass("hidden")
        .removeClass("show");
      break;
  }
});
const toggleWelcomeAndRaffleArea = () => {
  $("#welcomeCard").addClass("hidden");
  $("#raffleArea").removeClass("hidden");
};
const loadRememberedSettings = () => {
  const settings = JSON.parse(window.localStorage.getItem("userSettings"));
  if (!settings) {
    return;
  }
  raffleSettings = settings;
  // update raffle area
  createWheel(raffleSettings.data.items);
  toggleWelcomeAndRaffleArea();
  updateRaffleArea();
  // $("#raffleCanvas").prop({
  //   height: raffleSettings.general.raffleSize,
  //   width: 500,
  // });
};
loadRememberedSettings();
onSaveSettingsChanges = () => {
  if (tempRaffleData.length <= 1) {
    customSwal.info(
      "Just a sec...",
      "Please add two or more entries to continue"
    );
    return;
  }
  raffleSettings.data.source = $("#raffleDataSource").val();
  raffleSettings.data.items = tempRaffleData.slice();
  raffleSettings.general.title = $("#raffleTitleInput").val();
  raffleSettings.general.eliminateWinner = $("#eliminateWinnerSwitch").prop(
    "checked"
  );
  raffleSettings.general.rememberSettings = $("#rememberSettingsSwitch").prop(
    "checked"
  );
  raffleSettings.general.rememberSettings
    ? window.localStorage.setItem(
        "userSettings",
        JSON.stringify(raffleSettings)
      )
    : window.localStorage.removeItem(
        "userSettings",
        JSON.stringify(raffleSettings)
      );
  createWheel(raffleSettings.data.items);
  updateRaffleArea();
  toggleWelcomeAndRaffleArea();
  $("#settingsModal").modal("hide");
};
$(function () {
  // initalize boostrap tooltips
  $('[data-toggle="tooltip"]').tooltip();
  // instantiate SwalSetup class
  customSwal = new SwalSetup();
});
$("#manualEntrySubmitBtn").on("click", function () {
  if (!$("#manualEntryInput").val()) {
    return;
  }
  tempRaffleData.push($("#manualEntryInput").val());
  addRaffleDataItems([$("#manualEntryInput").val()], tempRaffleData.length - 1);
  $("#manualEntryInput").val("");
});
const removeRaffleDataItem = (e) => {
  tempRaffleData.splice(e.parent().parent().attr("data-position"), 1);
  $("#raffleDataItems").empty();
  addRaffleDataItems(tempRaffleData);
};
const onClearAllEntries = () => {
  Swal.fire({
    title: "Just a sec...",
    text: "Do you wish to clear all entries",
    icon: "info",
    confirmButtonText: "Yes",
    showCancelButton: true,
  }).then((action) => {
    if (action.isConfirmed) {
      $("#raffleDataItems").empty();
      tempRaffleData = [];
      addRaffleDataItems(tempRaffleData);
    }
  });
};

const onSpinWheel = () => {
  if (raffleSettings.hasEnded) {
    return;
  }
  $(".controlBtn").prop("disabled", true);
  theWheel.startAnimation();
};
const onResetWheel = () => {
  $("#winner").text("");
  $("#winners").empty();
  $("#winnersSection").addClass("hidden");
  updateWheel(raffleSettings.data.items);
};

const onSpinStopped = () => {
  const winner = theWheel.getIndicatedSegment();
  const originalWinnerColor = winner.fillStyle;
  const winnerPosition = theWheel.getIndicatedSegmentNumber();
  winner.fillStyle = "#000";
  $("#winner").text(winner.text).removeClass("hidden");
  theWheel.draw();
  setTimeout(() => {
    if (raffleSettings.general.eliminateWinner) {
      spinData.splice(winnerPosition - 1, 1);
      theWheel.deleteSegment(winnerPosition);
    }
    winner.fillStyle = originalWinnerColor;
    theWheel.rotationAngle = 0;
    theWheel.draw();
    if (spinData.length <= 1) {
      raffleSettings.hasEnded = true;
      $("#winner").text(`End of Raffle. Use reset to start over.`);
    } else {
      $("#winner").addClass("hidden");
    }
    $("#winners").prepend(
      `<li class='animate__animated animate__zoomIn'>${winner.text}</li>`
    );
    $("#winnersSection").removeClass("hidden");
    $(".controlBtn").prop("disabled", false);
  }, 5000);
};
const openDataSettings = () => {
  $("#data-settings-list").tab("show");
};
class SwalSetup {
  success(title = "", message = "") {
    Swal.fire(title, message, "success");
  }
  info(title = "Just a sec...!", message = "") {
    Swal.fire(title, message, "info");
  }
  error(title = "Sorry!", message = "Something bad happened") {
    Swal.fire(title, message, "error");
  }
  show(configurations) {
    Swal.fire(configurations);
  }
}
