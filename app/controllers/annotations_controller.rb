class AnnotationsController < ApplicationController
  before_action :set_annotation, only: [:show, :edit, :update, :destroy]

  # GET /annotations
  def index
    @study = Study.where('nct_id = ?', params['id']).try(:first)
  end

  # GET /annotations/1
  def show
  end

  # GET /annotations/new
  def new
    @annotation = Annotation.new({:nct_id=>params[:id],:label=>'- enter label for information -',:description=>'- enter information about this study -'})
    @study = Study.where('nct_id = ?', @annotation.nct_id).try(:first)
  end

  # GET /annotations/1/edit
  def edit
  end

  # POST /annotations
  # POST /annotations.json
  def create
    @annotation = Annotation.create({:nct_id=>annotation_params['nct_id'],:label=>annotation_params['label'],:description=>annotation_params['description']})

    if @annotation.save
      redirect_to @annotation.study, notice: 'Info was successfully created.'
    else
      render :new
    end
  end

  # PATCH/PUT /annotations/1
  def update
    if @annotation.update(annotation_params)
      #format.html { redirect_to @study, notice: 'Info was successfully updated.' }
      #redirect_to :controller => :studies, :action => :index
      redirect_to @study, notice: 'Info was successfully created.'
    else
      render :edit
    end
  end

  # DELETE /annotations/1
  # DELETE /annotations/1.json
  def destroy
    @annotation.destroy
    redirect_to @study, notice: 'Info removed.'
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_annotation
      @annotation = Annotation.find(params['id'])
      @study = Study.where('nct_id = ?', @annotation.nct_id).try(:first)
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def annotation_params
      if params[:commit]
        params.require(:annotation).permit(:id, :nct_id, :label, :description, :user_id, :commit, :utf8, :authenticity_token, :annotation)
      else
        params.permit(:id, :nct_id, :label, :description, :user_id, :utf8, :authenticity_token, :annotation)
      end
    end
end
