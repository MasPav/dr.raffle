let theWheel;
let raffleSettings = {
  general: {
    showTitle: false,
    title: '',
    raffleSize: '450',
    fontSize: '16',
    eliminateWinner: false,
    rememberSettings: true
  },
  data: {
    source: 'manual',
    items: [],
    originalItems: []
  },
  hasEnded: false
};
const addRaffleDataItems = (items, dataPosition = null) => {
  items.forEach((item, index) => {
    $('#raffleDataItems').prepend(
      `<h5 data-position="${dataPosition || index}">
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
  $('#raffleTitle').text(raffleSettings.general.title);
  if (raffleSettings.general.showTitle) {
    $('#raffleTitle').removeClass('hidden');
    $('#raffleTitleInput').prop('disabled', false);
  } else {
    $('#raffleTitle').addClass('hidden');
    $('#raffleTitleInput').prop('disabled', true);
  }
  $('#raffleCanvas').prop({
    height: raffleSettings.general.raffleSize,
    width: raffleSettings.general.raffleSize
  });
}
const initWinWheel = () => {
  const data = getFormattedRaffleData();
  theWheel = new Winwheel({
    canvasId: 'raffleCanvas',
    numSegments: data.length,
    responsive: true,
    segments: data,
    textFontFamily: 'sans-serif',
    textFontSize: raffleSettings.general.fontSize,
    textAlignment: 'outer',
    innerRadius: 40,
    // Note animation properties passed in constructor parameters.
    animation: {
      type: 'spinToStop', // Type of animation.
      duration: 5, // How long the animation is to take in seconds.
      spins: 10, // The number of complete 360 degree rotations the wheel is to do.
      easing: 'Power4.easeInOut',
      // Remember to do something after the animation has finished specify callback function.
      callbackFinished: 'onSpinStopped()'

      // During the animation need to call the drawTriangle() to re-draw the pointer each frame.
    },
    pointerAngle: 0,
    // Turn pointer guide on.
    pointerGuide: {
      display: false,
      strokeStyle: 'red',
      lineWidth: 3,
      textMargin: 0
    }
  });
};
const updateWheel = () => {
  initWinWheel();
  $('#welcomeCard').addClass('hidden');
  $('#raffleArea').removeClass('hidden');
};
const getFormattedRaffleData = () => {
  return raffleSettings.data.items.map((item, index) => ({
    text: item.length > 22 ? `${item.slice(0, 22)}...` : item,
    fillStyle: index % 2 === 0 ? '#007bff' : '#343a40',
    textFillStyle: '#fff'
  }));
};
$('#raffleDataSource').on('change', function () {
  raffleSettings.data.source = $(this).val();
  $('#raffleDataItems').empty();
  switch ($(this).val()) {
    case 'imports':
      $('#importsRaffleDataSource')
        .addClass('show')
        .removeClass('hidden');
      $('#manualRaffleDataSource, #apiRaffleDataSource')
        .addClass('hidden')
        .removeClass('show');
      break;
    case 'api':
      $('#apiRaffleDataSource')
        .addClass('show')
        .removeClass('hidden');
      $('#importsRaffleDataSource, #manualRaffleDataSource')
        .addClass('hidden')
        .removeClass('show');
      break;
    default:
      $('#manualRaffleDataSource')
        .addClass('show')
        .removeClass('hidden');
      $('#importsRaffleDataSource, #apiRaffleDataSource')
        .addClass('hidden')
        .removeClass('show');
      break;
  }
});
const loadRememberedSettings = () => {
  const settings = JSON.parse(window.localStorage.getItem('userSettings'));
  if (!settings) {
    return;
  }
  raffleSettings = settings;
  // update raffle area
  updateRaffleArea();
  updateWheel();
  // update settings modal
  // general tab
  $('#showRaffleTitleSwitch').prop('checked', raffleSettings.general.showTitle);
  $('#raffleTitleInput').prop('disabled', !raffleSettings.general.showTitle);
  $('#raffleTitleInput').val(raffleSettings.general.title);
  $('#raffleSize').val(raffleSettings.general.raffleSize);
  $('#raffleFontSize').val(raffleSettings.general.fontSize);
  $('#eliminateWinnerSwitch').prop(
    'checked',
    raffleSettings.general.eliminateWinner
  );
  $('#rememberSettingsSwitch').prop(
    'checked',
    raffleSettings.general.rememberSettings
  );
  // data tab
  $('#raffleDataSource')
    .val(raffleSettings.data.source)
    .trigger('change');
  addRaffleDataItems(raffleSettings.data.items);
};
loadRememberedSettings();
onSaveSettingsChanges = () => {
  raffleSettings.data.items = raffleSettings.data.items.filter(
    item => item !== null
  );
  if (raffleSettings.data.items.length <= 1) {
    alert('Not enough or no data has been provided for your raffle');
    return;
  }
  raffleSettings.data.originalItems = raffleSettings.data.items.slice();
  raffleSettings.general.title = $('#raffleTitleInput').val();
  raffleSettings.general.rememberSettings ? window.localStorage.setItem('userSettings', JSON.stringify(raffleSettings)) : window.localStorage.removeItem('userSettings', JSON.stringify(raffleSettings));
  updateRaffleArea();
  updateWheel();
  $('#settingsModal').modal('hide');
};
$(function () {
  // initalize boostrap tooltips
  $('[data-toggle="tooltip"]').tooltip();
  // $("#settingsModal").modal("show"); // remove when done
  /** Settings */
  // Begin General tab
  // raffle title
  $('#showRaffleTitleSwitch').on('change', function () {
    raffleSettings.general.showTitle = $(this).prop('checked');
    document.querySelector('#raffleTitleInput').toggleAttribute('disabled');
  });
  // raffle size
  $('#raffleSize').on('change', function () {
    // raffle size
    raffleSettings.general.raffleSize = $(this).val();
  });
  // raffle font size
  $('#raffleFontSize').on('change', function () {
    raffleSettings.general.fontSize = $(this).val();
  });
  // winner elimination
  $('#eliminateWinnerSwitch').on('change', function () {
    raffleSettings.general.eliminateWinner = $(this).prop('checked');
  });
  // remember saved raffle
  $('#rememberSettingsSwitch').on('change', function () {
    raffleSettings.general.rememberSettings = $(this).prop('checked');
  });

  // Begin Data tab
  // Manual Entries
  $('#manualEntrySubmitBtn').on('click', function () {
    if (!$('#manualEntryInput').val()) {
      return;
    }
    raffleSettings.data.items.push($('#manualEntryInput').val());
    addRaffleDataItems(
      [$('#manualEntryInput').val()],
      raffleSettings.data.items.length - 1
    );
    $('#manualEntryInput').val('');
  });
  // End Data tab
});
const removeRaffleDataItem = e => {
  delete raffleSettings.data.items[
    e
    .parent()
    .parent()
    .attr('data-position')
  ];
  e.parent()
    .parent()
    .remove();
};

const onSpinWheel = () => {
  if (raffleSettings.hasEnded) {
    return;
  }
  $('.controlBtn').prop('disabled', true);
  theWheel.startAnimation();
};
const onResetWheel = () => {
  raffleSettings.data.items = raffleSettings.data.originalItems;
  $('#winner').text('');
  $('#winnersSection').addClass('hidden');
  updateWheel();
};

const onSpinStopped = () => {
  const winner = theWheel.getIndicatedSegment();
  const originalWinnerColor = winner.fillStyle;
  const winnerPosition = theWheel.getIndicatedSegmentNumber();
  winner.fillStyle = '#000';
  $('#winner')
    .text(winner.text)
    .removeClass('hidden');
  theWheel.draw();
  setTimeout(() => {
    if (raffleSettings.general.eliminateWinner) {
      raffleSettings.data.items.splice(winnerPosition - 1, 1);
      theWheel.deleteSegment(winnerPosition);
    }
    winner.fillStyle = originalWinnerColor;
    theWheel.rotationAngle = 0;
    theWheel.draw();
    if (raffleSettings.data.items.length <= 1) {
      raffleSettings.hasEnded = true;
      $('#winner').text(`End of Raffle. Use reset to start over.`);
    } else {
      $('#winner').addClass('hidden');
    }
    $('#winners').prepend(
      `<li class='animate__animated animate__zoomIn'>${winner.text}</li>`
    );
    $('#winnersSection').removeClass('hidden');
    $('.controlBtn').prop('disabled', false);
  }, 5000);
};