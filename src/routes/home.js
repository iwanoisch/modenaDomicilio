import { Component, Fragment } from "preact";
import _isEmpty from "lodash.isempty";

import { ListCategory } from "../components/listCategory";
import { CategoryItem } from "../components/CategoryItem";

export default class Home extends Component {
   state = {
      filter: ""
   };

   handleChangeFilter = e => {
      const text = e.target.value;
      this.setState({ filter: text });
   };

   filteredCategories(filter) {
      const { results } = this.props;
      const regex = new RegExp(`${filter}`, "i");

      return Object.keys(results).reduce((acc, key) => {
         return {
            ...acc,
            [key]: {
               icon: results[key].icon,
               data: results[key].data.filter(e =>
                  filter.length ? regex.test(e.name) : true
               )
            }
         };
      }, {});
   }

   renderListByCategories() {
      const { filter } = this.state;
      const stores = this.filteredCategories(filter);

      return (
         Object.keys(stores) &&
         Object.keys(stores)
            .filter(key => stores[key].data.length)
            .map(key => (
               <ListCategory
                  name={key}
                  category={stores[key]}
                  filter={filter}
               />
            ))
      );
   }

   renderCategoriesList() {
		const { results } = this.props;
		const categories = Object.keys(results).reduce((acc, key) => {
			if (_isEmpty(results[key].data)) return acc;

			return [...acc, {
				id: key,
				name: key,
				icon: results[key].icon,
				stores: results[key].data.length
			}]
		}, [])		

      return (
			<div>
				{categories.map((c) => <CategoryItem key={c.id} name={c.name} stores={c.stores} icon={c.icon} />)}
			</div>
		);
   }

   render(_, { filter }) {
      return (
         <Fragment>
            <div class="relative p-5 lg:max-w-5xl xl:max-w-6xl lg:m-auto pb-10">
               <input
                  class="bg-white focus:outline-none focus:shadow-outline border border-gray-500 rounded-lg py-2 px-4 block w-full appearance-none leading-normal"
                  type="text"
                  placeholder="Cerca Attività"
                  onInput={this.handleChangeFilter}
               />
            </div>
            <div class="relative mb-10 font-sans text-md text-gray-800">
               {_isEmpty(filter)
                  ? this.renderCategoriesList()
                  : this.renderListByCategories()}
            </div>
            <div>
               <p class="mb-5 text-center">
                  Developed with ❤️ by{" "}
                  <a
                     class="text-orange-500"
                     href={process.env.PREACT_APP_DEV_LINK}
                  >
                     {process.env.PREACT_APP_DEV_NAME}
                  </a>
               </p>
            </div>
         </Fragment>
      );
   }
}
