
/* START Meta_fields table Seed */
INSERT INTO public.meta_fields (form_name,table_name,field_name,field_description,field_order,field_helper_text,field_data_type,field_input_type,field_action,field_action_values,role_permissions,created_at,updated_at) VALUES
	 ('admin_crowd_keys','crowd_keys','id','',1,'','','Input_text','','','admin','2021-10-22 15:33:57.369','2021-10-22 15:33:57.369'),
	 ('admin_crowd_keys','crowd_keys','crowd_key','',2,'','','Dropdown','List_Lookup','Select crowd_key from public.crowd_keys','admin','2021-10-22 15:33:57.369','2021-10-22 15:33:57.369'),
	 ('admin_crowd_keys','crowd_keys','crowd_key_type','',3,'','','Dropdown','List_Array','["","Not Used Yet"]','admin','2021-10-22 15:33:57.369','2021-10-22 15:33:57.369'),
	 ('admin_crowd_keys','crowd_keys','crowd_key_data_type','',4,'','','Input_text','','','admin','2021-10-22 15:33:57.369','2021-10-22 15:33:57.369'),
	 ('admin_crowd_keys','crowd_keys','crowd_key_primarykey','',5,'','','Dropdown','List_Array','["","nct_id","condition_id"]','admin','2021-10-22 15:33:57.369','2021-10-22 15:33:57.369'),
	 ('admin_crowd_keys','crowd_keys','default_facet_type','',6,'','','Input_text','','','admin','2021-10-22 15:33:57.369','2021-10-22 15:33:57.369'),
	 ('admin_crowd_keys','crowd_keys','indexed','',7,'','','Boolean','','','admin','2021-10-22 15:33:57.369','2021-10-22 15:33:57.369'),
	 ('admin_crowd_keys','crowd_keys','indexed_type','',8,'','','Input_text','','','admin','2021-10-22 15:33:57.369','2021-10-22 15:33:57.369'),
	 ('admin_crowd_keys','crowd_keys','crowd_key_description','',9,'','','Input_text','','','admin','2021-10-22 15:33:57.369','2021-10-22 15:33:57.369'),
	 ('admin_crowd_keys','crowd_keys','crowd_key_helper_text','',10,'','','Input_text','','','admin','2021-10-22 15:33:57.369','2021-10-22 15:33:57.369');
INSERT INTO public.meta_fields (form_name,table_name,field_name,field_description,field_order,field_helper_text,field_data_type,field_input_type,field_action,field_action_values,role_permissions,created_at,updated_at) VALUES
	 ('admin_crowd_keys','crowd_keys','crow_key_status','',11,'','','Input_text','','','admin','2021-10-22 15:33:57.369','2021-10-22 15:33:57.369'),
	 ('admin_crowd_keys','crowd_keys','crowd_key_default_icon','',12,'','','Input_text','','','admin','2021-10-22 15:33:57.369','2021-10-22 15:33:57.369'),
	 ('admin_crowd_keys','crowd_keys','created_at','',13,'','','View_Date','','','admin','2021-10-22 15:33:57.369','2021-10-22 15:33:57.369'),
	 ('admin_crowd_keys','crowd_keys','updated_at','',14,'','','View_Date','','','admin','2021-10-22 15:33:57.369','2021-10-22 15:33:57.369'),
	 ('admin_crowd_values','crowd_values','id','',1,'','','Input_text','','','admin','2021-10-22 15:33:57.369','2021-10-22 15:33:57.369'),
	 ('admin_crowd_values','crowd_values','crowd_key_id','',2,'','','Dropdown','List_Lookup','select id,crowd_key from public.crowd_keys','admin','2021-10-22 15:33:57.369','2021-10-22 15:33:57.369'),
	 ('admin_crowd_values','crowd_values','crowd_value','',3,'','','Input_text','','','admin','2021-10-22 15:33:57.369','2021-10-22 15:33:57.369'),
	 ('admin_crowd_values','crowd_values','crowd_value_description','',4,'','','Input_text','','','admin','2021-10-22 15:33:57.369','2021-10-22 15:33:57.369'),
	 ('admin_crowd_values','crowd_values','crowd_value_helper_text','',5,'','','Input_text','','','admin','2021-10-22 15:33:57.369','2021-10-22 15:33:57.369'),
	 ('admin_crowd_values','crowd_values','crowd_value_status','',6,'','','Input_text','','','admin','2021-10-22 15:33:57.369','2021-10-22 15:33:57.369');
INSERT INTO public.meta_fields (form_name,table_name,field_name,field_description,field_order,field_helper_text,field_data_type,field_input_type,field_action,field_action_values,role_permissions,created_at,updated_at) VALUES
	 ('admin_crowd_values','crowd_values','crowd_value_default_icon','',7,'','','Input_text','','','admin','2021-10-22 15:33:57.369','2021-10-22 15:33:57.369'),
	 ('admin_crowd_values','crowd_values','created_at','',8,'','','View_Date','','','admin','2021-10-22 15:33:57.369','2021-10-22 15:33:57.369'),
	 ('admin_crowd_values','crowd_values','updated_at','',9,'','','View_Date','','','admin','2021-10-22 15:33:57.369','2021-10-22 15:33:57.369'),
	 ('island_configs','island_configs','id','',1,'','','Input_text','','','admin','2021-10-22 15:33:57.369','2021-10-22 15:33:57.369'),
	 ('island_configs','island_configs','config','',2,'','','JSON_Form','','','admin','2021-10-22 15:33:57.369','2021-10-22 15:33:57.369'),
	 ('island_configs','island_configs','island_type','',3,'','','Dropdown','["facet","sort"]','','admin','2021-10-22 15:33:57.369','2021-10-22 15:33:57.369'),
	 ('page_views','page_views','id','',1,'','','Input_text','','','admin','2021-10-22 15:33:57.369','2021-10-22 15:33:57.369'),
	 ('page_views','page_views','site_id','',2,'','','Input_text','','','admin','2021-10-22 15:33:57.369','2021-10-22 15:33:57.369'),
	 ('page_views','page_views','title','',3,'','','Input_text','','','admin','2021-10-22 15:33:57.369','2021-10-22 15:33:57.369'),
	 ('page_views','page_views','template','',4,'','','Input_text','','','admin','2021-10-22 15:33:57.369','2021-10-22 15:33:57.369');
INSERT INTO public.meta_fields (form_name,table_name,field_name,field_description,field_order,field_helper_text,field_data_type,field_input_type,field_action,field_action_values,role_permissions,created_at,updated_at) VALUES
	 ('page_views','page_views','updates','',5,'','','JSON_Form','','','admin','2021-10-22 15:33:57.369','2021-10-22 15:33:57.369'),
	 ('page_views','page_views','page_type','',6,'','','Input_text','','','admin','2021-10-22 15:33:57.369','2021-10-22 15:33:57.369'),
	 ('page_views','page_views','url','',7,'','','Input_text','','','admin','2021-10-22 15:33:57.369','2021-10-22 15:33:57.369'),
	 ('page_views','page_views','created_at','',8,'','','View_Date','','','admin','2021-10-22 15:33:57.369','2021-10-22 15:33:57.369'),
	 ('page_views','page_views','updated_at','',9,'','','View_Date','','','admin','2021-10-22 15:33:57.369','2021-10-22 15:33:57.369'),
	 ('page_views','page_views','default','',10,'','','Boolean','','','admin','2021-10-22 15:33:57.369','2021-10-22 15:33:57.369'),
	 ('sites','sites','id','',1,'','','Input_text','','','admin','2021-10-22 15:33:57.369','2021-10-22 15:33:57.369'),
	 ('sites','sites','name','',2,'','','Input_text','','','admin','2021-10-22 15:33:57.369','2021-10-22 15:33:57.369'),
	 ('sites','sites','subdomain','',3,'','','Input_text','','','admin','2021-10-22 15:33:57.369','2021-10-22 15:33:57.369'),
	 ('sites','sites','created_at','',4,'','','View_Date','','','admin','2021-10-22 15:33:57.369','2021-10-22 15:33:57.369');
INSERT INTO public.meta_fields (form_name,table_name,field_name,field_description,field_order,field_helper_text,field_data_type,field_input_type,field_action,field_action_values,role_permissions,created_at,updated_at) VALUES
	 ('sites','sites','updated_at','',5,'','','View_Date','','','admin','2021-10-22 15:33:57.369','2021-10-22 15:33:57.369'),
	 ('sites','sites','skip_landing','',6,'','','Boolean','','','admin','2021-10-22 15:33:57.369','2021-10-22 15:33:57.369'),
	 ('sites','sites','themes','',7,'','','Input_text','','','admin','2021-10-22 15:33:57.369','2021-10-22 15:33:57.369'),
	 ('sites','sites','user_rank','',8,'','','Input_text','','','admin','2021-10-22 15:33:57.369','2021-10-22 15:33:57.369'),
	 ('sites','sites','reactions_config','',9,'','','Input_text','','','admin','2021-10-22 15:33:57.369','2021-10-22 15:33:57.369'),
	 ('sites','sites','hide_donation','',10,'','','Boolean','','','admin','2021-10-22 15:33:57.369','2021-10-22 15:33:57.369'),
	 ('sites','sites','default_hash','',11,'','','Input_text','','','admin','2021-10-22 15:33:57.369','2021-10-22 15:33:57.369'),
	 ('sites','sites','default_search_page','',12,'','','Input_text','','','admin','2021-10-22 15:33:57.369','2021-10-22 15:33:57.369'),
	 ('island_configs_JSON_facet','island_configs','id','',1,'','','Input_text','','','admin','2021-10-22 15:33:57.369','2021-10-22 15:33:57.369'),
	 ('island_configs_JSON_facet','island_configs','island_type','',3,'','','Dropdown','','{"aggs","crowdAggs","workflow"}','admin','2021-10-22 15:33:57.369','2021-10-22 15:33:57.369');
INSERT INTO public.meta_fields (form_name,table_name,field_name,field_description,field_order,field_helper_text,field_data_type,field_input_type,field_action,field_action_values,role_permissions,created_at,updated_at) VALUES
	 ('island_configs_JSON_facet','island_configs','config.aggKind','',1,'','','Dropdown','','','admin','2021-10-22 15:33:57.369','2021-10-22 15:33:57.369'),
	 ('island_configs_JSON_facet','island_configs','config.name','',2,'','','Dropdown','','','admin','2021-10-22 15:33:57.369','2021-10-22 15:33:57.369'),
	 ('island_configs_JSON_facet','island_configs','config.displayName','',3,'','','Input_Text','','','admin','2021-10-22 15:33:57.369','2021-10-22 15:33:57.369'),
	 ('island_configs_JSON_facet','island_configs','config.display','',4,'','','Dropdown','','','admin','2021-10-22 15:33:57.369','2021-10-22 15:33:57.369'),
	 ('island_configs_JSON_facet','island_configs','config.defaultToOpen','',5,'','','Boolean','','','admin','2021-10-22 15:33:57.369','2021-10-22 15:33:57.369'),
	 ('island_configs_JSON_facet','island_configs','config.showAllowMissing','',6,'','','Boolean','','','admin','2021-10-22 15:33:57.369','2021-10-22 15:33:57.369'),
	 ('island_configs_JSON_facet','island_configs','config.showFilterToolbar','',7,'','','Boolean','','','admin','2021-10-22 15:33:57.369','2021-10-22 15:33:57.369'),
	 ('island_configs_JSON_facet','island_configs','config.aggSublabel','',8,'','','Input_Text','','','admin','2021-10-22 15:33:57.369','2021-10-22 15:33:57.369'),
	 ('island_configs_JSON_facet','island_configs','config.maxCrumbs','',9,'','','Input_Text','','','admin','2021-10-22 15:33:57.369','2021-10-22 15:33:57.369'),
	 ('island_configs_JSON_facet','island_configs','config.order','',10,'','','JSON_Text','','{"sortKind":"key,count","desc": false}','admin','2021-10-22 15:33:57.369','2021-10-22 15:33:57.369');
INSERT INTO public.meta_fields (form_name,table_name,field_name,field_description,field_order,field_helper_text,field_data_type,field_input_type,field_action,field_action_values,role_permissions,created_at,updated_at) VALUES
	 ('island_configs_JSON_facet','island_configs','config.rangeEndLabel','',11,'','','Input_Text','','','admin','2021-10-22 15:33:57.369','2021-10-22 15:33:57.369'),
	 ('island_configs_JSON_facet','island_configs','config.rangeStartLabel','',12,'','','Input_Text','','','admin','2021-10-22 15:33:57.369','2021-10-22 15:33:57.369'),
	 ('island_configs_JSON_facet','island_configs','config.visibleOptions','',13,'','','JSON_Text','','{"kind":"WHITELIST","values":["array1","array2"]}','admin','2021-10-22 15:33:57.369','2021-10-22 15:33:57.369'),
	 ('island_configs_JSON_facet','island_configs','config.rank','',14,'','','Hidden','','','admin','2021-10-22 15:33:57.369','2021-10-22 15:33:57.369'),
	 ('island_configs_JSON_facet','island_configs','config.bucketKeyValuePairs','',15,'','','Hidden','','','admin','2021-10-22 15:33:57.369','2021-10-22 15:33:57.369'),
	 ('island_configs_JSON_facet','island_configs','config.layout','',16,'','','Hidden','','','admin','2021-10-22 15:33:57.369','2021-10-22 15:33:57.369'),
	 ('island_configs_JSON_facet','island_configs','config.autoSuggest','',17,'','','Hidden','','','admin','2021-10-22 15:33:57.369','2021-10-22 15:33:57.369'),
	 ('island_configs_JSON_facet','island_configs','config.preselected','',18,'','','Hidden','','','admin','2021-10-22 15:33:57.369','2021-10-22 15:33:57.369'),
	 ('island_configs_JSON_facet','island_configs','config.bucketTemplate','',19,'','','Input_Text','','','admin','2021-10-22 15:33:57.369','2021-10-22 15:33:57.369'),
	 ('island_configs_JSON_sort','island_configs','id','',1,'','','Input_text','','','admin','2021-10-22 15:33:57.369','2021-10-22 15:33:57.369');
INSERT INTO public.meta_fields (form_name,table_name,field_name,field_description,field_order,field_helper_text,field_data_type,field_input_type,field_action,field_action_values,role_permissions,created_at,updated_at) VALUES
	 ('island_configs_JSON_sort','island_configs','island_type','',3,'','','Dropdown','','{"aggs","crowdAggs","workflow"}','admin','2021-10-22 15:33:57.369','2021-10-22 15:33:57.369'),
	 ('island_configs_JSON_sort','island_configs','config.sortables','',1,'','','JSON_Text','','[{
         "fieldName":"fm_Karnofsky Allowed Minimum",
         "displayName":"Karnofsky Allowed Min ▲",
         "desc": false
      }]','admin','2021-10-22 15:33:57.369','2021-10-22 15:33:57.369'),
	 ('users','users','first_name','First Name',1,'','','Input_Text','','','','2021-10-22 15:33:57.369','2021-10-22 15:33:57.369'),
	 ('users','users','last_name','Last Name',2,'','','Input_Text','','','','2021-10-22 15:33:57.369','2021-10-22 15:33:57.369'),
	 ('users','users','email','User email',3,'','','View_Text','','','','2021-10-22 15:33:57.369','2021-10-22 15:33:57.369'),
	 ('users','users','password','Password',4,'Reset password through ','','View_Password','','','','2021-10-22 15:33:57.369','2021-10-22 15:33:57.369'),
	 ('users','users','picture_url','',5,'','','Input_Text','','','','2021-10-22 15:33:57.369','2021-10-22 15:33:57.369'),
	 ('users','users','search_last_notification','Last Notification',6,'','','Input_Text','','','','2021-10-22 15:33:57.369','2021-10-22 15:33:57.369'),
	 ('users','users','id','Add Role',7,'','','Link','Other_Form_Add','meta_form_id=4','','2021-10-22 15:33:57.369','2021-10-22 15:33:57.369'),
	 ('users','users','created_at','',8,'','','View_Date','Format','Short_Date','','2021-10-22 15:33:57.369','2021-10-22 15:33:57.369');
INSERT INTO public.meta_fields (form_name,table_name,field_name,field_description,field_order,field_helper_text,field_data_type,field_input_type,field_action,field_action_values,role_permissions,created_at,updated_at) VALUES
	 ('users','users','updated_at','',9,'','','View_Date','','','','2021-10-22 15:33:57.369','2021-10-22 15:33:57.369'),
	 ('users','users','id','Delete User',10,'','','Button','Delete','','','2021-10-22 15:33:57.369','2021-10-22 15:33:57.369'),
	 ('users','users','id','Save',11,'','','Button','Update','','','2021-10-22 15:33:57.369','2021-10-22 15:33:57.369'),
	 ('user_roles','user_roles','user_id','',1,'','','View_Text','','','','2021-10-22 15:33:57.369','2021-10-22 15:33:57.369'),
	 ('user_roles','user_roles','role_id','',2,'','','Dropdown','List_Array','["3"]','','2021-10-22 15:33:57.369','2021-10-22 15:33:57.369'),
	 ('user_roles','user_roles','created_at','',3,'','','View_Date','','','','2021-10-22 15:33:57.369','2021-10-22 15:33:57.369'),
	 ('user_roles','user_roles','updated_at','',4,'','','View_Date','','','','2021-10-22 15:33:57.369','2021-10-22 15:33:57.369'),
	 ('user_roles','user_roles','id','Delete Role',5,'','','Button','Delete','','','2021-10-22 15:33:57.369','2021-10-22 15:33:57.369'),
	 ('user_roles','user_roles','id','Save Role',6,'','','Button','Update','','','2021-10-22 15:33:57.369','2021-10-22 15:33:57.369'),
	 ('meta_fields','meta_fields','id','',1,'','','View_Text','','','','2021-10-22 15:33:57.369','2021-10-22 15:33:57.369');
INSERT INTO public.meta_fields (form_name,table_name,field_name,field_description,field_order,field_helper_text,field_data_type,field_input_type,field_action,field_action_values,role_permissions,created_at,updated_at) VALUES
	 ('meta_fields','meta_fields','form_name','',2,'','','Input_Text','','','','2021-10-22 15:33:57.369','2021-10-22 15:33:57.369'),
	 ('meta_fields','meta_fields','table_name','',3,'','','Dropdown','List_Lookup','Table_List','','2021-10-22 15:33:57.369','2021-10-22 15:33:57.369'),
	 ('meta_fields','meta_fields','field_name','',4,'','','Dropdown','List_Lookup','Field_List:table_name={{table_name}}','','2021-10-22 15:33:57.369','2021-10-22 15:33:57.369'),
	 ('meta_fields','meta_fields','field_description','',5,'','','Input_Text','','','','2021-10-22 15:33:57.369','2021-10-22 15:33:57.369'),
	 ('meta_fields','meta_fields','field_order','',6,'','','Input_Text','','','','2021-10-22 15:33:57.369','2021-10-22 15:33:57.369'),
	 ('meta_fields','meta_fields','field_helper_text','',7,'','','Input_Text','','','','2021-10-22 15:33:57.369','2021-10-22 15:33:57.369'),
	 ('meta_fields','meta_fields','field_data_type','',8,'','','Dropdown','List_Array','["","Input_Text","View_Text","Input_Date","View_Password","Link","Button","JSON_Form","Boolean"]','','2021-10-22 15:33:57.369','2021-10-22 15:33:57.369'),
	 ('meta_fields','meta_fields','field_input_type','',9,'','','Dropdown','List_Array','["","Input_Text","View_Text","Input_Date","View_Password","Link","Button","JSON_Form","Boolean"]','','2021-10-22 15:33:57.369','2021-10-22 15:33:57.369'),
	 ('meta_fields','meta_fields','field_action','',10,'','','Dropdown','List_Array','["","Other_Form_Add","Delete","Update","Format"]','','2021-10-22 15:33:57.369','2021-10-22 15:33:57.369'),
	 ('meta_fields','meta_fields','field_action_values','',11,'','','Input_Text','','','','2021-10-22 15:33:57.369','2021-10-22 15:33:57.369');
INSERT INTO public.meta_fields (form_name,table_name,field_name,field_description,field_order,field_helper_text,field_data_type,field_input_type,field_action,field_action_values,role_permissions,created_at,updated_at) VALUES
	 ('meta_fields','meta_fields','role_permissions','',12,'','','Input_Text','','','','2021-10-22 15:33:57.369','2021-10-22 15:33:57.369'),
	 ('meta_fields','meta_fields','created_at','',13,'','','View_Date','','','','2021-10-22 15:33:57.369','2021-10-22 15:33:57.369'),
	 ('meta_fields','meta_fields','updated_at','',14,'','','View_Date','','','','2021-10-22 15:33:57.369','2021-10-22 15:33:57.369'),
	 ('meta_fields','meta_fields','id','Delete',15,'','','Button','Delete','','','2021-10-22 15:33:57.369','2021-10-22 15:33:57.369'),
	 ('meta_fields','meta_fields','id','Save',16,'','','Button','Update','','','2021-10-22 15:33:57.369','2021-10-22 15:33:57.369');

     /* END Meta_fields table Seed */
