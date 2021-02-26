let raffleData = [];
let theWheel;
const getRaffleData = () => {
    return fetch(
            "https://5javhg6vja.execute-api.eu-west-1.amazonaws.com/Stage/getusers"
        )
        .then((response) => {
            if (response.ok) {
                return response.json();
            } else {
                console.log('err');
            }
        })
        .catch((err) => {
            console.log(err);
        });
}
const initWinWheel = () => {
    theWheel = new Winwheel({
        canvasId: "raffle-canvas",
        numSegments: raffleData.length,
        lineWidth: "1",
        responsive: true,
        segments: raffleData,
        textFontFamily: "sans-serif",
        'rotationAngle': -30,
        'animation': // Note animation properties passed in constructor parameters.
        {
            'type': 'spinToStop', // Type of animation.
            'duration': 5, // How long the animation is to take in seconds.
            'spins': 10, // The number of complete 360 degree rotations the wheel is to do.
            'easing': 'Power4.easeInOut'
        }
    });
}
getRaffleData().then(res => {
    data = [{
        name: "Cyprian Ampong Boateng"
    }, {
        name: "Isla-Grace Hensley"
    }, {
        name: "Vinny Pearce"
    }, {
        name: "Pawel Donnelly"
    }, {
        name: "Gavin Brewer"
    }, {
        name: "Brenda Bond"
    }];
    raffleData = data.map((item, index) => ({
        text: item.name.length > 22 ? `${item.name.slice(0, 22)}...` : item.name,
        fillStyle: index % 2 === 0 ? "#000" : "#fff",
        textFillStyle: index % 2 === 0 ? "#fff" : "#000"
    }));
    initWinWheel();
});
const onSpinWheel = () => {
    theWheel.startAnimation();
    setTimeout(() => {
        theWheel.stopAnimation(false);
        theWheel.rotationAngle = 0;
        theWheel.draw();
        document.getElementsByClassName('mainDiv')[0].classList.add('flex');
        document.getElementsByClassName('winnersWrapper')[0].classList.add('w-2/5');
        document.getElementsByClassName('winnersWrapper')[0].classList.remove('hidden');
        document.getElementsByClassName('wheelDiv')[0].classList.add('w-3/5');
        setTimeout(() => {
            document.getElementsByClassName('winner')[0].classList.add('hidden');
        }, 5000);
    }, 5000);
}
const onResetWheel = () => {
    document.getElementsByClassName('mainDiv')[0].classList.remove('flex');
    document.getElementsByClassName('winnersWrapper')[0].classList.remove('w-2/5');
    document.getElementsByClassName('winnersWrapper')[0].classList.add('hidden');
    document.getElementsByClassName('wheelDiv')[0].classList.remove('w-3/5');
}
// const setWinner = () => {
//     document.getElementsByClassName('winner')[0].;
// }