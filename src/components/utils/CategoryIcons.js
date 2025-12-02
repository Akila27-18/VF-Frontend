// frontend/src/utils/getCategoryIcon.js
import housingIcon from "../assets/categories/housing.png";
import foodIcon from "../assets/categories/food.png";
import utilitiesIcon from "../assets/categories/utilities.png";
import transportIcon from "../assets/categories/transport.png";
import shoppingIcon from "../assets/categories/shopping.png";
import entertainmentIcon from "../assets/categories/entertainment.png";
import otherIcon from "../assets/categories/other.png";

const map = {
  Housing: housingIcon,
  Food: foodIcon,
  Utilities: utilitiesIcon,
  Transport: transportIcon,
  Shopping: shoppingIcon,
  Entertainment: entertainmentIcon,
};

export default function getCategoryIcon(category) {
  if (!category) return otherIcon;
  return map[category] || otherIcon;
}
