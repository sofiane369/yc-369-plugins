function cleanUp() {
  jQuery("#reviews-wrapper").remove();
}

function drawReviews(reviewSrc, columnWidth, gutter, limit = 20) {
  cleanUp();

  var next_page = 1;

  const $showMoreButton = jQuery("#show-more");
  $showMoreButton.before(
    '<div class="grid369" style="margin: 0 auto; flex-wrap: wrap;"></div>'
  );
  $showMoreButton.prop("disabled", false);
  $showMoreButton.css({
    display: "none",
    margin: "0 auto",
    "margin-top": "20px",
    "margin-bottom": "20px",
    padding: "10px 20px",
    "background-color": "#f39c12",
    color: "white",
    border: "none",
    "border-radius": "5px",
    cursor: "pointer",
  });
  $showMoreButton.click(() => {
    next_page += 1;
    loadReviews(
      reviewSrc,
      columnWidth,
      gutter,
      limit,
      next_page,
      $showMoreButton
    );
  });

  var $grid = jQuery(".grid369");
  $grid.css({
    margin: "0 auto",
    "flex-wrap": "wrap",
  });

  // Initialize Masonry
  $grid.masonry({
    itemSelector: ".grid-item",
    columnWidth: columnWidth,
    gutter: gutter,
    fitWidth: true,
  });

  loadReviews(
    reviewSrc,
    columnWidth,
    gutter,
    limit,
    next_page,
    $showMoreButton
  );
}
function loadReviews(
  endpoint,
  columnWidth,
  gutter,
  limit,
  page = 1,
  $showMoreButton
) {
  // Fetch data from the API
  const $grid = jQuery(".grid369");
  fetch(`${endpoint}?limit=${limit}&page=${page}`)
    .then((response) => response.json())
    .then((data) => {
      $("li.general-count").attr('class', 'general-reviews-count');
      if (data?.meta?.pagination?.total) {
        const text = `(${data.meta.pagination.total} التقييمات)`
        jQuery("li.general-reviews-count").text(text);
      }
      // Loop through the data array
      data.data.forEach((review) => {
        const $gridItem = createItem(review, columnWidth, gutter);
        $grid.append($gridItem).masonry("appended", $gridItem);
      });

      if (
        data.meta.pagination.current_page >= data.meta.pagination.total_pages
      ) {
        $showMoreButton.css({
          display: "none",
        });
      } else {
        $showMoreButton.css({
          display: "block",
        });
      }
    })
    .catch((error) => console.error("Error:", error));
}
function createItem(review, itemWidth, margin) {
  const imgCSS =
    "width: 100%; height: 300px; object-fit: cover; padding: 0; border-top-left-radius: 4px; border-top-right-radius: 4px;";
  const img =
    review.images_urls.length > 0
      ? `<img src="${review.images_urls[0]}" style="${imgCSS}">`
      : "";

  const filledStars = "★".repeat(review.ratings);
  const emptyStars = "☆".repeat(5 - review.ratings);

  const comment = jQuery(review.content);
  const $gridItem = jQuery(`
    <div class="grid-item">
        <div style="border: 1px solid #EDEFEF;border-radius:5px; background-color: #FEFFFF">
            ${img} 
            <div style="padding: 5px; direction: rtl;">
                <span style="font-size: 14px; font-weight: bold;">${
                  review.first_name
                }</span>
                <div style="font-size: 13px; font-weight: bold; color: #f39c12;">${filledStars}${emptyStars}</div>
                <span style="font-size: 12px;">${new Date(
                  review.last_name
                ).toLocaleDateString()}</span>
                <p style="margin: 0; margin-top: 4px;">${comment.text()}</p>
            </div>   
        </div>
    </div>
    `);
  $gridItem.css({
    width: itemWidth + "px",
    "margin-bottom": margin + "px",
    "margin-right": margin + "px",
  });

  return $gridItem;
}
