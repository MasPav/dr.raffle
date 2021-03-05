let theWheel;
let raffleConfig = {}
const raffleData = [{
        name: 'Akwasi Boateng'
    },
    {
        name: 'Benjamin Acheampong'
    },
    {
        name: 'Daniel Twumasi'
    },
    {
        name: 'Ford Prior'
    },
    {
        name: 'Jerry Agudogo'
    },
    {
        name: 'Kwaku Appiah- Adu'
    },
    {
        name: 'NATHANIEL NAT'
    },
    {
        name: 'Nkwenti Fon'
    },
    {
        name: 'Yusuf'
    },
    {
        name: 'Vincent Quainoo'
    },
    {
        name: 'Steve Kamanke'
    },
    {
        name: 'Edem'
    },
    {
        name: 'Olena'
    },
    {
        name: 'Nii Akai'
    }
];
$(function () {
    initWinWheel();
    /** Settings */
    // raffle title
    $('#showRaffleTitleSwitch').on('change', function () {
        document.querySelector('#raffleTitleInput').toggleAttribute('disabled');
        $('#raffleTitle').toggle();
    });
    $('#raffleTitleInput').on('keyup', function () {
        $('#raffleTitle').text($(this).val())
    });
    // raffle size
    $('#raffleSize').on('change', function () {
        // switch ($(this).val()) {
        //     case 'sm':
        //         raffleConfig.size = 300;
        //         break;
        //     case 'md':
        //         raffleConfig.size = 500;
        //         break;
        //     default:
        //         raffleConfig.size = 700;
        //         break;
        // }
        // $('#raffleCanvas').prop('height', $(this).val());
        // console.log($('#raffleCanvas'));
    })
});
const initWinWheel = () => {
    theWheel = new Winwheel({
        canvasId: 'raffleCanvas',
        numSegments: raffleData.length,
        lineWidth: '3',
        responsive: true,
        segments: raffleData,
        textFontFamily: 'sans-serif',
        textAlignment: 'outer',
        textFontWeight: 'bold',
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