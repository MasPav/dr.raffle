let theWheel;
let raffleSettings = {
  general: {
    fontSize: "16",
  },
  data: {
    source: "manual",
    items: [],
  },
};
const raffleData = [
  {
    name: "Akwasi Boateng",
  },
  {
    name: "Benjamin Acheampong",
  },
  {
    name: "Daniel Twumasi",
  },
  {
    name: "Ford Prior",
  },
  {
    name: "Jerry Agudogo",
  },
  {
    name: "Kwaku Appiah- Adu",
  },
  {
    name: "NATHANIEL NAT",
  },
  {
    name: "Nkwenti Fon",
  },
  {
    name: "Yusuf",
  },
  {
    name: "Vincent Quainoo",
  },
  {
    name: "Steve Kamanke",
  },
  {
    name: "Edem",
  },
  {
    name: "Olena",
  },
  {
    name: "Nii Akai",
  },
];
$(function () {
  // initalize boostrap tooltips
  $('[data-toggle="tooltip"]').tooltip();
  // initalize winwheel
  initWinWheel(raffleData);
  $("#settingsModal").modal("show"); // remove when done
  /** Settings */
  // Begin General tab
  // raffle title
  $("#showRaffleTitleSwitch").on("change", function () {
    document.querySelector("#raffleTitleInput").toggleAttribute("disabled");
    $("#raffleTitle").toggle();
  });
  $("#raffleTitleInput").on("keyup", function () {
    $("#raffleTitle").text($(this).val());
  });
  // raffle size
  $("#raffleSize").on("change", function () {
    $("#raffleCanvas").prop({ height: $(this).val(), width: $(this).val() });
    initWinWheel(raffleData);
  });
  // raffle font size
  $("#raffleFontSize").on("change", function () {
    raffleSettings.general.fontSize = $(this).val();
    initWinWheel(getFormattedRaffleData());
  });
  // End Begin General tab
  // Begin Data tab
  $("#raffleDataSource").on("change", function () {
    raffleSettings.data.source = $(this).val();
    $("#manualEntries").empty();
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
  // Manual Entries
  $("#manualEntrySubmitBtn").on("click", function () {
    if (!$("#manualEntryInput").val()) {
      return;
    }
    raffleSettings.data.items.push($("#manualEntryInput").val());
    $("#manualEntries").prepend(
      `<h5 class="manualEntryItem" data-position="${
        raffleSettings.data.items.length - 1
      }">
      <span class="badge text-primary shadow-sm">
        <span class="me-1">${$("#manualEntryInput").val()}</span>
        <i onclick="removeManualEntryItem($(this))"
          class="fas fa-times-circle text-muted align-middle hover-cursor-pointer"
        ></i>
      </span>
    </h5>`
    );
    $("#manualEntryInput").val("");
  });
  // End Data tab
});
const removeManualEntryItem = (e) => {
  delete raffleSettings.data.items[e.parent().parent().attr("data-position")];
  e.parent().parent().remove();
};
$("#applyRaffleDataChangesBtn").on("click", function () {
  raffleSettings.data.items = raffleSettings.data.items.filter(
    (item) => item !== null
  );
  if (raffleSettings.data.items.length <= 0) {
    return;
  }
  initWinWheel(getFormattedRaffleData());
});
const getFormattedRaffleData = () => {
  return raffleSettings.data.items.map((item, index) => ({
    text: item.length > 22 ? `${item.slice(0, 22)}...` : item,
    fillStyle: index % 2 === 0 ? "#195190FF" : "#A2A2A1FF",
    textFillStyle: "#fff",
  }));
};
const initWinWheel = (data) => {
  theWheel = new Winwheel({
    canvasId: "raffleCanvas",
    numSegments: data.length,
    responsive: true,
    segments: data,
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
      lineWidth: 3,
      textMargin: 0,
    },
  });
};
