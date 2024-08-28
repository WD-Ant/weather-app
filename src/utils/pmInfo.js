const learnBtn = document.querySelector('.pm__text__btn');
const learnMoreInfo = document.querySelector('.pm__text__para');

const pmInfo = () => {
    learnBtn.addEventListener('click', () => {
        learnMoreInfo.style.display = 'block';
    })
}

export default pmInfo;