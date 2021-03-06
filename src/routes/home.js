import { Component, Fragment } from "preact";
import { route } from 'preact-router';
import _isEmpty from "lodash.isempty";

import { ListCategory } from "../components/listCategory";
import { CategoryItem } from "../components/CategoryItem";
import { Footer } from "../components/Footer";

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
               title: results[key].title,
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
				name: results[key].title,
				icon: results[key].icon,
				stores: results[key].data.length
			}]
		}, [])		

      return (
			<div>
				{categories.map((c) => <CategoryItem key={c.id} name={c.name} stores={c.stores} icon={c.icon} onClick={() => route(`categorie/${c.id}`)} />)}
			</div>
		);
   }

   render(_, { filter }) {
      return (
         <Fragment>
            <div class="relative p-5 lg:max-w-5xl xl:max-w-6xl lg:m-auto pb-10">
               <input
                  class="shadow appearance-none border rounded w-full py-4 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
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
            <Footer />
         </Fragment>
      );
   }
}
