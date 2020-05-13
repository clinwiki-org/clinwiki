class AddInteventioonSiteViews < ActiveRecord::Migration[5.2]
  def change
    sites_with_intervention = []
    #Find sites that have a siteview with the  type intervention
    SiteView.all.each do |site_view|
      if site_view.view[:search][:type] =="intervention"
        sites_with_intervention.push(site_view.site_id)
      end
    end
    #Find sites that do not have a siteview with the  type intervention
    sites_without_intervention = Site.where.not(id:sites_with_intervention)
    #add site_view of type intervention to the sites without them
    sites_without_intervention.each do |site|
      site.site_views.new(name:"Intervention",url:"intervention",default:false, updates: Site.default_intervention_updates)
      site.save
    end
  end
end
