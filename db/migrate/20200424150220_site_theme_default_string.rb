class SiteThemeDefaultString < ActiveRecord::Migration[5.2]
  def change
    change_column_default(:sites, :themes, "#{
      {
      primaryColor:"#6BA5D6",
      secondaryColor:"#1b2a38",
      lightTextColor:"#eee",
      secondaryTextColor:"#333",
      backgroundColor:"#4D5863",
      primaryAltColor:"#5786AD",
      authHeaderColor:"#5786AD",
      sideBarColor: "333"
      }.to_json} ")
  end
end
