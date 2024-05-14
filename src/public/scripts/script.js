const creationForm = document.querySelector(".creation-form");
if (creationForm) {
  creationForm.addEventListener("submit", onCreationFormSubmit);
}

const editingForm = document.querySelector(".editing-form");
if (editingForm) {
  editingForm.addEventListener("submit", onEditingFormSubmit);
}

const imgInput = document.querySelector(".img-input");
if (imgInput) {
  imgInput.addEventListener("input", onInputImg);
}

const sportHallsSwiperElement = document.querySelector(".sport-halls-swiper");
if (sportHallsSwiperElement) {
  const sportHallsSwiper =  new Swiper(sportHallsSwiperElement, {
    direction: 'horizontal',
    loop: true,
    pagination: {
      el: '.sport-halls-swiper__swiper-pagination',
    },
    navigation: {
      nextEl: '.sport-halls-swiper__swiper-button-next',
      prevEl: '.sport-halls-swiper__swiper-button-prev',
    },
    slidesPerView: 2,
    slidesPerGroup: 2,
    spaceBetween: 40
  });
}

const trainersSwiperElement = document.querySelector(".trainers-swiper");
if (trainersSwiperElement) {
  const trainersSwiper =  new Swiper(trainersSwiperElement, {
    direction: 'horizontal',
    loop: true,
    pagination: {
      el: '.trainers-swiper__swiper-pagination',
    },
    navigation: {
      nextEl: '.trainers-swiper__swiper-button-next',
      prevEl: '.trainers-swiper__swiper-button-prev',
    },
    slidesPerView: 4,
    slidesPerGroup: 4,
    spaceBetween: 40
  });
}

const programsSwiperElement = document.querySelector(".programs-swiper");
if (programsSwiperElement) {
  const programsSwiper =  new Swiper(programsSwiperElement, {
    direction: 'horizontal',
    loop: true,
    pagination: {
      el: '.programs-swiper__swiper-pagination',
    },
    navigation: {
      nextEl: '.programs-swiper__swiper-button-next',
      prevEl: '.programs-swiper__swiper-button-prev',
    },
    slidesPerView: 2,
    slidesPerGroup: 2,
    spaceBetween: 40
  });
}

const deleteBtnList = document.querySelectorAll(".delete-btn");
for (const btn of deleteBtnList) {
  btn.addEventListener("click", onDeleteBtnClick);
}