class AnnotationsController < ApplicationController
  before_action :set_annotation, only: [:show, :edit, :update, :destroy]
  skip_before_action :verify_authenticity_token

  # GET /annotations
  def index
    @study = Study.where('nct_id = ?', params['id']).try(:first)
  end

  # GET /annotations/1
  def show
  end

  # GET /annotations/new
  def new
    @annotation = Annotation.new({:nct_id=>params[:id],:label=>'enter label for information',:description=>'enter summary information about this study'})
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
      render json: @annotation
    end
  end

  # PATCH/PUT /annotations/1
  def update
    if @annotation.update({description: annotation_params[:description]})
      #format.html { redirect_to @study, notice: 'Info was successfully updated.' }
      #redirect_to :controller => :studies, :action => :index
      render json: @annotation
    end
  end

  # DELETE /annotations/1
  # DELETE /annotations/1.json
  def destroy
    @annotation.destroy
    render json: { success: true }
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_annotation
      @annotation = Annotation.find(params['id'])
      @study = Study.where('nct_id = ?', @annotation.nct_id).try(:first)
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def annotation_params
      params
    end
end
